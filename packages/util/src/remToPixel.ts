export default function remToPixels(remValue: number) {
  if (typeof window !== "undefined") {
    // Get the root font size
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    )

    // Convert rem to pixels
    const pixelsValue = remValue * rootFontSize

    return pixelsValue
  }
  return 0
}
