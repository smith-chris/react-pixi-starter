import React from 'react'
import { Sprite } from '@inlet/react-pixi'
import { Point, Texture, Rectangle, BaseTexture } from 'pixi.js'
import minotaurImage from 'assets/minotaur-idle.png'

const cutTexture = (baseTexture: BaseTexture) => (
  x = 0,
  y = 0,
  width = 1,
  height = 1,
) => {
  const tx = new Texture(baseTexture)
  tx.frame = new Rectangle(x, y, width, height)
  return tx
}

const makeTexture = (asset: ImageAsset) => {
  const { baseTexture } = Texture.from(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  // @ts-ignore
  baseTexture.width = asset.width
  // @ts-ignore
  baseTexture.height = asset.height

  return {
    cutTexture: cutTexture(baseTexture),
  }
}

const mtx = makeTexture(minotaurImage)
const texture = mtx.cutTexture(0, 0, 128, 80)

export const Minotaur = ({ x = 0, y = 400 }: { x: number; y?: number }) => {
  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      scale={5}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
