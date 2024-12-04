import { Extension } from "@tiptap/core";
import { convertPxToUnitlessLineHeight } from "./utils";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setLineHeight: {
      setLineHeight: (lineHeight: number) => ReturnType;
    };
    unsetLineHeight: {
      unsetLineHeight: () => ReturnType;
    };
  }
}

type LineHeightOptions = {
  types: string[];
  defaultLineHeight?: number;
};

export const LineHeight = Extension.create<LineHeightOptions>({
  name: "lineHeight",
  addOptions() {
    return {
      types: [],
      defaultLineHeight: 1.5,
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            parseHTML: (element) => {
              return convertPxToUnitlessLineHeight(
                element,
                this.options.defaultLineHeight
              );
            },
            renderHTML: (attributes) => {
              /*if (attributes.lineHeight === this.options.defaultLineHeight) {
                return {}
              }*/
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { lineHeight })
          );
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.resetAttributes(type, "lineHeight")
          );
        },
    };
  },
});
