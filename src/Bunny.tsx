import React from 'react'
import { Sprite } from '@inlet/react-pixi'
import { Point } from 'pixi.js'

let rotation = 0

export const RotatingBunny = ({ x }: { x: number }) => (
  <Sprite
    image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
    x={x}
    y={300}
    scale={[2 + Math.abs(2 * rotation), 2 + Math.abs(2 * rotation)]}
    rotation={rotation}
    anchor={new Point(0.5, 0.5)}
  />
)
