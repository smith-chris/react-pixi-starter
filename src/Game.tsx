import React, { useState } from 'react'

import { center } from 'setup/dimensions'
import { Sprite, useTick } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

import baseImage from 'assets/sprites/base.png'

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
        {...center}
        image={require('assets/sprites/yellowbird-midflap.png').src}
      />
      <Sprite {...baseProps} x={baseOffset} image={baseImage.src} />
    </>
  )
}
