export type SpacingProps = {
  before: number;
  after: number;
};

export type SpacingPropsWithLineHeight = SpacingProps & {
  lineHeight: number;
};

export type SpacingOptions = {
  types: string[];
  defaultSpacing?: SpacingProps;
};
