import React, { useState } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import bunny from './assets/bunny.png'

export const RotatingBunny = ({ x }: { x: number }) => {
  const [rotation, setRotation] = useState(0)

  useTick((time = 0) => {
    setRotation(rotation + 0.05)
  })

  return (
    <Sprite
      image={bunny.src}
      x={x}
      interactive
      pointerdown={() => {
        console.log('hello world')
        setRotation(rotation - 0.5)
      }}
      y={400}
      scale={5}
      rotation={rotation}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
