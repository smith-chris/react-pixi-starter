declare module '*.png' {
  // thanks to sizeof-loader we get width and height of the asset
  export type ImageAsset = {
    src: string
    width: number
    height: number
  }

  const image: ImageAsset

  export default image
}

declare module '*.fnt' {
  const font: string

  export default font
}
