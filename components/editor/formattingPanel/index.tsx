"use client";

import { Button } from "@/components/ui/button";
import { AlignmentSettings } from "./alignment-settings";
import { IndentationSettings } from "./indentation-settings";
import { SpacingSettings } from "./spacing-settings";
import { useFormatSettings } from "./useFormatSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Editor } from "@tiptap/react";

export function FormattingPanel({ editor }: { editor: Editor }) {
  const {
    formatState,
    handleFormatChange,
    handleSpacingChange,
    handleLineHeightChange,
    handleApplyAll,
    handleAlignmentChange,
  } = useFormatSettings(editor);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-4 flex-shrink-0">
        <CardTitle>Formatting</CardTitle>
        <CardDescription>Format items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 flex-grow overflow-auto">
        <ScrollArea className="h-full">
          <div className="space-y-4 mr-1">
            <AlignmentSettings
              alignment={formatState.alignment}
              setAlignment={handleAlignmentChange}
            />

            <IndentationSettings
              options={formatState.indentation}
              setOptions={handleFormatChange}
              editor={editor}
            />

            <SpacingSettings
              options={{
                ...formatState.spacing,
                lineHeight: formatState.lineHeight,
              }}
              setSpacing={handleSpacingChange}
              setLineHeight={handleLineHeightChange}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
