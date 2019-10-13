declare type ImageAsset = {
  src: string
  width: number
  height: number
}

declare module '*.png' {
  // thanks to sizeof-loader we get width and height of the asset

  const image: ImageAsset

  export default image
}

declare module '*.fnt' {
  const font: string

  export default font
}
