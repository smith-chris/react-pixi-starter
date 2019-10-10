import React, { useState } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import bunny from 'assets/bunny.png'
// import { hot } from 'react-hot-loader/root'

export const RotatingBunny = ({ x, y = 400 }: { x: number; y?: number }) => {
  const [rotation, setRotation] = useState(0)

  useTick(() => {
    setRotation(rotation + 0.005)
  })

  return (
    <Sprite
      image={typeof bunny === 'string' ? bunny : bunny.src}
      x={x}
      interactive
      pointerdown={() => {
        console.log('hello world')
        setRotation(rotation - 0.5)
      }}
      y={y}
      scale={5}
      rotation={rotation}
      anchor={new Point(0.5, 0.5)}
    />
  )
}

// export const RotatingBunnyHot = hot(RotatingBunny)
