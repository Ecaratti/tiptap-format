"use client";

import { Editor } from "@tiptap/react";
import { Indent, List, ListOrdered, Outdent } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-md">
      <div className="flex items-center gap-1 p-1">
        <Select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : "p"
          }
          onValueChange={(value) => {
            if (value === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: parseInt(value.charAt(1)) as 1 | 2 | 3,
                })
                .run();
            }
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="icon"
          variant="ghost"
          className={`p-2 rounded hover:bg-accent h-8 w-8 ${
            editor.isActive("bulletList") ? "bg-accent" : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="icon"
          variant="ghost"
          className={`p-2 rounded hover:bg-accent h-8 w-8 ${
            editor.isActive("orderedList") ? "bg-accent" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().indent().run()}
          size="icon"
          variant="ghost"
          className={`p-2 rounded hover:bg-accent h-8 w-8`}
          title="Indent"
        >
          <Indent className="h-4 w-4" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().outdent().run()}
          size="icon"
          variant="ghost"
          className={`p-2 rounded hover:bg-accent h-8 w-8`}
          title="Outdent"
        >
          <Outdent className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
