import { Editor, Extension } from "@tiptap/core";
import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import { IndentationOptions } from "../Formatting/types";
import { checkFormattingExists, getIndent, getOutdent } from "./utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

export type IndentOptions = {
  maxLevel: number;
  step: number;
};

export type IndentStorage = {
  step: number;
  maxLevel: number;
};

export const Indent = Extension.create<IndentOptions, IndentStorage>({
  name: "indent",

  addOptions() {
    return {
      maxLevel: 11,
      step: 6,
    };
  },

  addStorage() {
    return {
      step: this.options.step,
      maxLevel: this.options.maxLevel,
    };
  },

  addCommands(this) {
    return {
      indent:
        () =>
        ({ chain, editor }) => {
          if (!checkFormattingExists(editor)) {
            return false;
          }
          const selection = editor.state.selection;
          const type = selection.$head.parent.type.name;

          // Check if current node type is supported
          if (!editor?.storage?.formatting?.nodeTypes.includes(type)) {
            return false;
          }

          const { formatting } = editor.getAttributes(type);
          const { left = 0, by = 0, special = "none" } = formatting || {};

          let newFormatting: IndentationOptions;

          //first indent makes a firstLine indent (as in Word), then it's a normal indent.
          if (by === 0 || special === "none") {
            newFormatting = {
              ...formatting,
              special: "first-line",
              by: this.options.step,
              left,
            };
          } else {
            const newLeft = Math.min(
              left + this.options.step,
              this.options.step * this.options.maxLevel
            );
            newFormatting = {
              ...formatting,
              left: newLeft,
            };
          }

          return (
            chain()
              .setFormatting(newFormatting)
              //.adjustLevel({ direction: "up" }) //TODO (sorry guys, my implementation of this was with custom counterNodes, not listItem and ::before pseudoElements, and I don"t feel like figuring out the styling)
              .run()
          );
        },

      outdent:
        () =>
        ({ chain, editor }) => {
          const selection = editor.state.selection;
          const type = selection.$head.parent.type.name;

          const NodesWithFormatting = editor?.storage?.formatting?.nodeTypes;

          if (!NodesWithFormatting) {
            console.warn("Formatting plugin is required for indentation");
            return false;
          }
          // Check if current node type is supported
          if (!NodesWithFormatting.includes(type)) {
            return false;
          }

          const { formatting } = editor.getAttributes(type);
          const { left = 0, by = 0, special = "first-line" } = formatting || {};

          let newFormatting: IndentationOptions;

          if (special === "first-line" && by !== 0) {
            newFormatting = {
              ...formatting,
              by: 0,
              special: "none",
            };
          } else {
            newFormatting = {
              ...formatting,
              left: Math.max(0, left - this.options.step),
            };
          }

          return (
            chain()
              .setFormatting(newFormatting)
              // .adjustLevel({ direction: "down" })
              .run()
          );
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("indent"),
        props: {
          handleKeyDown(view, event) {
            //couldn't use tiptap's addKeyboardShortcuts because it doesn't allow event.preventDefault() and event.stopPropagation()

            if (!checkFormattingExists(editor)) {
              return false;
            }

            //we want default behaviour if there is a selection (as opposed to simply having the cursor on one position)
            if (!editor.state.selection.empty) {
              return false;
            }

            if (event.key === "Tab") {
              event.preventDefault(); //else would leave the editor
              event.stopPropagation();

              if (!event.shiftKey) {
                return getIndent({ event, editor, onlyAtHead: false });
              } else {
                return getOutdent({ event, editor, onlyAtHead: false });
              }
            }

            if (event.key === "Backspace") {
              const { formatting, numbering_listRef } = editor.getAttributes(
                editor.state.selection.$head.parent.type.name
              );
              const isNumbered = !!numbering_listRef;

              if (
                editor.state.selection.$head.parentOffset > (isNumbered ? 2 : 0)
              ) {
                return false; //only at head
              }
              //if there is no indentation we want to have the default behaviour (i.e. remove the paragraph)

              const {
                left = 0,
                by = 0,
                right = 0,
                special = "none",
              } = formatting || {};

              // Handle numbered list with hanging indent
              // In this case we want to remove the numbering and keep the indentation.
              if (isNumbered && special === "hanging") {
                return editor
                  .chain()
                  .focus()
                  .setFormatting({
                    right,
                    by: 0,
                    left: left + by,
                    special: "none",
                  })
                  .run();
              }

              // Return false if there's no indentation at all
              if (left === 0 && (by === 0 || special === "none")) {
                return false;
              }

              // Handle first-line indent case separately
              if (by !== 0 && left === 0) {
                return editor
                  .chain()
                  .focus()
                  .setFormatting({
                    ...formatting,
                    by: 0,
                    special: "none",
                  })
                  .run();
              }

              return getOutdent({
                event,
                editor,
                onlyAtHead: true, //only outdent if the cursor is at the beginning of the line
              });
            }

            return false;
          },
        },
      }),
    ];
  },

  onUpdate() {
    const { editor } = this;
    if (editor.isActive("listItem")) {
      const node = editor.state.selection.$head.node();
      if (node.attrs.indent) {
        editor.commands.updateAttributes(node.type.name, { indent: 0 });
      }
    }
  },
});
