import { Extension } from "@tiptap/core";
import { IndentationOptions } from "./types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    formatting: {
      setFormatting: (options: IndentationOptions) => ReturnType;
    };
  }
}

export const DEFAULT_FORMATTING: IndentationOptions = {
  left: 0,
  right: 0,
  special: "none",
  by: 0,
};

type FormattingOptions = {
  types: string[];
  defaultFormatting?: IndentationOptions;
};

type FormattingStorage = {
  nodeTypes: string[];
};

export const Formatting = Extension.create<
  FormattingOptions,
  FormattingStorage
>({
  name: "formatting",

  //added storage for the
  addStorage() {
    return {
      nodeTypes: [] as string[],
    };
  },

  addOptions() {
    return {
      types: [],
      defaultFormatting: DEFAULT_FORMATTING,
    };
  },

  onCreate() {
    this.storage.nodeTypes = this.options.types;
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          formatting: {
            default: this.options.defaultFormatting,
            parseHTML: (element) => ({
              left: parseInt(element.getAttribute("data-format-left") || "0"),
              right: parseInt(element.getAttribute("data-format-right") || "0"),
              special: element.getAttribute("data-format-special") || "none",
              by: parseInt(element.getAttribute("data-format-by") || "0"),
            }),
            renderHTML: (attributes) => {
              const { left, right, special, by } = attributes.formatting;
              const isNumbered = !!attributes?.numbering_listRef;
              const followBy = attributes?.numbering_followBy;
              return {
                style: returnFormattingStyles(
                  attributes.formatting,
                  isNumbered,
                  followBy
                ),
                "data-format-left": left,
                "data-format-right": right,
                "data-format-special": special,
                "data-format-by": by,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFormatting:
        (options: IndentationOptions) =>
        ({ commands }) => {
          return this.options.types.every((type: string) => {
            return commands.updateAttributes(type, {
              formatting: options,
            });
          });
        },
    };
  },
});

//As mentionned aboce, I did not feel like figuring out the styling for lists and pseudo elements, so I just used the default styling for lists.
//Just know that the behaviour of the formatting is not only dependent on whether there is numbering, but also whether numbering is
//followed by a space, a tab or nothing.

function returnFormattingStyles(
  options: IndentationOptions,
  isNumbered = false,
  followBy: "space" | "tab" | "nothing" = "nothing"
) {
  const multiplier = 8; //Maybe not ideal, word uses centimeters, I just used a multiplier to make it look good. This is purely arbitraty.

  const left = Number(options.left) ?? 0;
  const right = Number(options.right) ?? 0;
  const special = options.special;
  const by = Number(options.by) ?? 0;

  let marginLeft = left * multiplier;
  let textIndent = 0;
  let counterWidth = 0;

  const hanging = special === "hanging";
  const hangingBy = hanging ? by ?? 0 : 0;

  if (hanging) {
    marginLeft += hangingBy * multiplier;
    if (isNumbered) {
      if (followBy == "tab") {
        counterWidth = hangingBy * multiplier;
      }
      textIndent = -Math.min(hangingBy * multiplier, marginLeft);
    } else {
      textIndent = -Math.min(hangingBy * multiplier, marginLeft);
    }
  }

  const firstLine = special === "first-line";
  const firstLineBy = firstLine ? by : 0;
  if (firstLine) {
    textIndent = firstLineBy * multiplier /*  * 2 */;
    if (isNumbered && followBy === "tab") {
      counterWidth = firstLineBy * multiplier;
      textIndent = 0;
    }
  }
  //styling is made in collaboration with formatting.scss
  //px is important as using em would make indentation inconsistent accross heading/paragraphs
  return `
  text-indent: ${textIndent}px; 
  padding-left: ${marginLeft}px; 
  padding-right: ${right * multiplier}px;
  --counterWidth: ${counterWidth}px;
  `;
}
