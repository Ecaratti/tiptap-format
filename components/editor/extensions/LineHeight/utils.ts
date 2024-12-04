export function convertPxToUnitlessLineHeight(
  element: HTMLElement,
  defaultLineHeight: number = 1.5
): number {
  const lineHeightInPx = parseFloat(element.style.lineHeight);
  const fontSizeInPx = parseFloat(getComputedStyle(element).fontSize);

  if (!isNaN(lineHeightInPx) && !isNaN(fontSizeInPx) && fontSizeInPx !== 0) {
    return lineHeightInPx / fontSizeInPx;
  }

  return defaultLineHeight;
}
