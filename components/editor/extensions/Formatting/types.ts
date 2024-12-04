export type IndentationSpecials = "none" | "first-line" | "hanging";

export type IndentationOptions = {
  left: number;
  right: number;
  special: IndentationSpecials;
  by: number;
};

export type FormattingOptions = {
  types: string[];
  defaultFormatting?: IndentationOptions;
  maxIndentationLevel?: number;
  step?: number;
};

export type FormattingStorage = {
  types: string[];
  maxIndentationLevel?: number;
  step?: number;
};
