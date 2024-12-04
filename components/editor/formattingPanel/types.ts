import { IndentationOptions } from "../extensions/Formatting/types";
import { SpacingProps } from "../extensions/Spacing/types";

export type FormatState = {
  alignment: string;
  indentation: IndentationOptions;
  spacing: SpacingProps;
  lineHeight: number;
};
