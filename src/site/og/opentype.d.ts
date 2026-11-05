// The little of opentype.js the share images use (the font build in tools/fonts uses it from plain JavaScript).
declare module "opentype.js" {
  interface Path {
    toPathData(decimals?: number): string
  }
  interface Font {
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: { letterSpacing?: number; kerning?: boolean },
    ): Path
    getAdvanceWidth(text: string, fontSize: number): number
  }
  const opentype: { parse(buffer: ArrayBuffer): Font }
  export default opentype
}
