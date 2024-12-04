export function pixelsToPoints(pixels: number | string): number {
  // Convert string input to number, removing 'px' if present
  const pixelValue =
    typeof pixels === "string" ? parseFloat(pixels.replace("px", "")) : pixels;

  const pointsPerPixel = 0.75;
  return Math.round(pixelValue * pointsPerPixel);
}

export function pointsToPixels(points: number | string): number {
  // Convert string input to number
  const pointValue = typeof points === "string" ? parseFloat(points) : points;

  const pointsPerPixel = 0.75;
  return Math.round(pointValue / pointsPerPixel);
}
