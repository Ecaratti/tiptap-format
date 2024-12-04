import { Editor, useEditorState } from "@tiptap/react";
import { useDebounce } from "@uidotdev/usehooks";

export const useCurrentEditorStateAnchorPos = (editor: Editor) => {
  return useDebounce(useCurrentEditorStateBase(editor), 200); //since the userEditorState dictates when the editor is updated, we need to debounce it to prevent excessive re-renders
};

const useCurrentEditorStateBase = (editor: Editor) => {
  const EditorStateHeadings = useEditorState({
    editor,
    selector: (ctx) => ({
      anchor: ctx.editor?.state.selection?.$anchor,
    }),
    equalityFn: (prev, next) => {
      if (!next) return false;
      return prev.anchor === next.anchor;
    },
  });

  return EditorStateHeadings;
};
