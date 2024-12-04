import { Editor } from "@tiptap/react";

type indentProps = {
  event: KeyboardEvent;
  editor: Editor;
  onlyAtHead: boolean;
};

export const checkFormattingExists = (editor: Editor) => {
  const NodesWithFormatting = editor.storage?.formatting?.nodeTypes;
  if (!NodesWithFormatting) {
    console.warn("Formatting plugin is required for indentation");
    return false;
  }
  return true;
};

export const getIndent = ({ event, editor, onlyAtHead }: indentProps) => {
  //only at head: only indent if the cursor it at the beginning of the node (useful to outdent on backspace)
  if (onlyAtHead && editor.state.selection.$head.parentOffset > 0) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();

  if (editor.can().sinkListItem("listItem")) {
    return editor.chain().focus().sinkListItem("listItem").run();
  }
  return editor.chain().focus().indent().run();
};

export const getOutdent = ({ event, editor, onlyAtHead }: indentProps) => {
  if (onlyAtHead && editor.state.selection.$head.parentOffset > 0) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();

  if (
    (!onlyAtHead || editor.state.selection.$head.parentOffset > 0) &&
    editor.can().liftListItem("listItem")
  ) {
    return editor.chain().focus().liftListItem("listItem").run();
  }
  //ideally it would be this:
  //return editor.chain().focus().outdent().run();
  //but setFormatting running on array.every() returns false
  editor.chain().focus().outdent().run();
  return true;
};
