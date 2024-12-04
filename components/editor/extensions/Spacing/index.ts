import { Extension } from "@tiptap/core";
import { SpacingOptions } from "./types";
import { SpacingProps } from "./types";
import { pointsToPixels } from "../utils";
import { pixelsToPoints } from "../utils";

//!!Important note: spacing, indent and formatting are expressed in points, not pixels (1 point = 1.33333 pixels)

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spacing: {
      setSpaceBeforeAfter: (
        position: "before" | "after",
        value: number
      ) => ReturnType;
      setSpace: ({
        before,
        after,
      }: {
        before: number;
        after: number;
      }) => ReturnType;
      incrementSpace: (
        position: "before" | "after",
        value: number
      ) => ReturnType;
    };
  }
}

export const DEFAULT_SPACING: SpacingProps = { before: 0, after: 6 };

export const Spacing = Extension.create<SpacingOptions>({
  name: "spacing",

  addOptions() {
    return {
      types: [],
      defaultSpacing: DEFAULT_SPACING,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          spacing: {
            default: this.options.defaultSpacing,
            parseHTML: (element) => ({
              before: element.style.marginTop
                ? pixelsToPoints(element.style.marginTop)
                : this.options.defaultSpacing!.before,
              after: element.style.marginBottom
                ? pixelsToPoints(element.style.marginBottom)
                : this.options.defaultSpacing!.after,
            }),
            renderHTML: (attributes) => {
              const { before = 0, after = 0 } = attributes.spacing ?? {};
              return {
                style: `margin-top: ${pointsToPixels(
                  before
                )}px; margin-bottom: ${pointsToPixels(after)}px;`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setSpaceBeforeAfter:
        (position: "before" | "after", value: number) =>
        ({ commands, editor }) => {
          return this.options.types.every((type: string) => {
            const currentSpacing =
              editor.getAttributes(type).spacing ?? this.options.defaultSpacing;
            return commands.updateAttributes(type, {
              spacing: {
                ...currentSpacing,
                [position]: value,
              },
            });
          });
        },

      setSpace:
        ({ before, after }) =>
        ({ commands, editor }) => {
          return this.options.types.every((type: string) => {
            return commands.updateAttributes(type, {
              spacing: { before, after },
            });
          });
        },

      incrementSpace:
        (position: "before" | "after", value: number) =>
        ({ commands, editor }) => {
          return this.options.types.every((type: string) => {
            const currentSpacing =
              editor.getAttributes(type).spacing ?? this.options.defaultSpacing;
            const currentValue = currentSpacing[position] ?? 0;
            const newValue = Math.max(currentValue + value, 0);
            return commands.updateAttributes(type, {
              spacing: {
                ...currentSpacing,
                [position]: newValue,
              },
            });
          });
        },
    };
  },
});
