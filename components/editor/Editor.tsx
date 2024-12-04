"use client";
import "./styles/index.css";
import "./extensions/Formatting/formatting.scss";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FormattingPanel } from "./formattingPanel";
import { Indent, LineHeight, Spacing } from "./extensions";
import { Formatting } from "./extensions";
import { Toolbar } from "./toolbar";
import TextAlign from "@tiptap/extension-text-align";

export const Editor = () => {
  const editor = useEditor({
    autofocus: true,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,

    extensions: [
      StarterKit,
      Formatting.configure({
        types: [
          "heading",
          "paragraph",
          "codeBlock",
          "image",
          "horizontalRule",
          "bulletList",
          "orderedList",
        ],
      }),
      LineHeight.configure({
        types: ["heading", "paragraph"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "orderedList", "bulletList"],
      }),
      Spacing.configure({
        types: ["heading", "paragraph", "orderedList", "bulletList"],
      }),
      Indent.configure({
        step: 6, // in pts
      }),
    ],
  });

  if (!editor) return null;

  return (
    <div className="h-full w-full flex min-h-0">
      <div className="flex flex-col w-full">
        <div className="flex-none">
          <Toolbar editor={editor} />
        </div>
        <ScrollArea className="h-full min-w-0 mt-2 rounded-sm flex w-full flex-grow ">
          <div className="w-full xl:w-5xl h-full max-h-full min-h-0 pb-2 overflow-clip flex flex-col items-center">
            <div className="relative max-w-5xl w-full h-full max-h-full min-h-0">
              <EditorContent
                spellCheck={false}
                className={cn(
                  "collaborative-editor mt-2 p-16 min-w-0 h-full bg-white shadow-xl rounded-md min-h-[1500px]"
                )}
                editor={editor}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="w-[600px]">
        <FormattingPanel editor={editor} />
      </div>
    </div>
  );
};
