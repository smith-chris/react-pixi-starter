import React, { useState } from 'react'

import { Sprite, useTick } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

import baseImage from 'assets/sprites/base.png'
import { Bird } from 'components/Bird'

export const Game = () => {
  const { bottom } = useViewport()
  const [baseOffset, setBaseOffset] = useState(0)

  const baseProps = {
    anchor: new Point(0, 1),
    y: Math.max(450, bottom),
  }

  useTick((delta = 0) => {
    setBaseOffset(v => (v < -46 ? 0 : v - delta))
  })

  return (
    <>
      <Sprite
        {...baseProps}
        image={require('assets/sprites/background-day.png').src}
      />
      <Sprite
        anchor={0.5}
        x={200}
        y={400}
        image={require('assets/sprites/pipe-green.png').src}
      />
      <Sprite
        anchor={0.5}
        x={200}
        y={-100}
        scale={[1, -1]}
        image={require('assets/sprites/pipe-green.png').src}
      />
      <Bird />
      <Sprite {...baseProps} x={baseOffset} image={baseImage.src} />
    </>
  )
}
