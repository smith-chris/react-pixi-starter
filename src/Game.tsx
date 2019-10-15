import React from 'react'

import {
  center,
  centerBottom,
  designHeight,
  designWidth,
} from 'setup/dimensions'
import { Sprite } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'

export const Game = () => {
  const { bottom } = useViewport()

  const baseY = Math.max(450, bottom)

  return (
    <>
      <Sprite
        anchor={[0.5, 1]}
        x={designWidth / 2}
        y={baseY}
        image={require('assets/sprites/background-day.png').src}
      />
      <Sprite
        {...center}
        image={require('assets/sprites/yellowbird-midflap.png').src}
      />
      <Sprite
        anchor={[0.5, 1]}
        x={designWidth / 2}
        y={baseY}
        image={require('assets/sprites/base.png').src}
      />
    </>
  )
}
