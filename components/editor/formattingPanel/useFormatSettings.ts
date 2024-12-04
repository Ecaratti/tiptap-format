import { useEffect, useState } from "react";

import { DEFAULT_FORMATTING } from "@/components/editor/extensions/Formatting";
import { useCurrentEditorStateAnchorPos } from "@/components/editor/hooks/useCurrentEditorStateAnchorPos";
import { Node } from "@tiptap/pm/model";
import { Editor, findParentNodeClosestToPos } from "@tiptap/react";
import { IndentationOptions } from "../extensions/Formatting/types";
import { FormatState } from "./types";
import { SpacingProps } from "../extensions/Spacing/types";

const DEFAULT_SPACING = {
  before: 0,
  after: 0,
  lineHeight: "1.5",
};

export function useFormatSettings(
  editor: Editor,
  triggerImmediatelyOnChange = true
) {
  const [currentNode, setCurrentNode] = useState<Node | null>(null);

  const { anchor } = useCurrentEditorStateAnchorPos(editor);

  useEffect(() => {
    const NodesWithFormatting = editor?.storage?.formatting?.nodeTypes;
    if (anchor && NodesWithFormatting) {
      const result = findParentNodeClosestToPos(anchor, (node) =>
        NodesWithFormatting.includes(node.type.name)
      );
      if (result) {
        setCurrentNode(result.node);
      }
    }
  }, [anchor, setCurrentNode, editor]);

  useEffect(() => {
    setFormatState(returnDefaultState(currentNode));
  }, [currentNode]);

  function returnDefaultState(node: Node | null): FormatState {
    const lineHeightValue = node?.attrs?.lineHeight;
    const defaultLineHeight = 1.5;
    return {
      alignment: node?.attrs?.textAlign ?? "left",
      indentation: {
        ...DEFAULT_FORMATTING,
        ...node?.attrs?.formatting,
      },
      spacing: {
        ...DEFAULT_SPACING,
        before: node?.attrs?.spacing?.before || 0,
        after: node?.attrs?.spacing?.after || 0,
      },
      lineHeight:
        !lineHeightValue || isNaN(Number(lineHeightValue))
          ? defaultLineHeight
          : lineHeightValue,
    };
  }

  const [formatState, setFormatState] = useState<FormatState>(
    returnDefaultState(currentNode)
  );

  const handleFormatChange = (options: IndentationOptions) => {
    setFormatState((prev) => ({ ...prev, indentation: options }));
    if (triggerImmediatelyOnChange) {
      editor?.chain().focus().setFormatting(options).run();
    }
  };

  const handleSpacingChange = (options: SpacingProps) => {
    setFormatState((prev) => ({ ...prev, spacing: options }));
    if (triggerImmediatelyOnChange) {
      editor?.commands.setSpace(options);
    }
  };

  const handleLineHeightChange = (lineHeight: number | string) => {
    if (typeof lineHeight !== "number") {
      lineHeight = Number(lineHeight);
    }
    if (isNaN(lineHeight)) {
      return;
    }

    setFormatState((prev) => ({ ...prev, lineHeight }));
    if (triggerImmediatelyOnChange) {
      editor?.chain().focus().setLineHeight(lineHeight).run();
    }
  };

  const handleAlignmentChange = (alignment: string) => {
    setFormatState((prev) => ({ ...prev, alignment }));
    if (triggerImmediatelyOnChange) {
      editor?.commands.setTextAlign(alignment);
    }
  };

  const handleApplyAll = () => {
    editor?.chain().focus().setFormatting(formatState.indentation).run();
    editor?.commands.setSpace(formatState.spacing);
    editor?.commands.setLineHeight(formatState.lineHeight);
    editor?.commands.setTextAlign(formatState.alignment);
  };

  return {
    formatState,
    setFormatState,
    handleFormatChange,
    handleSpacingChange,
    handleLineHeightChange,
    handleApplyAll,
    handleAlignmentChange,
  };
}
