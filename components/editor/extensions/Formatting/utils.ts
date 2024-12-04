import { IndentationOptions } from "./types";

export function returnFormattingStyles(
  options: IndentationOptions,
  isNumbered = true,
  followBy: "space" | "tab" | "nothing" = "tab"
) {
  const multiplier = 8; // Now using em instead of px

  const left = Number(options.left) ?? 0;
  const right = Number(options.right) ?? 0;
  const special = options.special;
  const by = Number(options.by) ?? 0;

  let marginLeft = left * multiplier;
  let textIndent = 0;
  let counterWidth = 0;

  const hanging = special === "hanging";
  const hangingBy = hanging ? by ?? 0 : 0;

  if (hanging) {
    marginLeft += hangingBy * multiplier;
    if (isNumbered) {
      if (followBy == "tab") {
        counterWidth = hangingBy * multiplier;
      }
      textIndent = -Math.min(hangingBy * multiplier, marginLeft);
    } else {
      textIndent = -Math.min(hangingBy * multiplier, marginLeft);
    }
  }

  const firstLine = special === "first-line";
  const firstLineBy = firstLine ? by : 0;
  if (firstLine) {
    textIndent = firstLineBy * multiplier /*  * 2 */;
    if (isNumbered && followBy === "tab") {
      counterWidth = firstLineBy * multiplier;
      textIndent = 0;
    }
  }
  //styling is made in collaboration with formatting.scss
  return `
    text-indent: ${textIndent}px; 
    padding-left: ${marginLeft}px; 
    padding-right: ${right * multiplier}px;
    --counterWidth: ${counterWidth}px;
    `;
}
