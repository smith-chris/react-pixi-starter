import React, { useState } from 'react'

import { Sprite, useTick } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

import baseImage from 'assets/sprites/base.png'
import { Bird } from 'components/Bird'
import { useGameResolvers } from 'useGameResolvers'
import { useGameState } from 'hooks/useGameState'
import { Typography } from 'components/Typography'
import { designWidth, designHeight } from 'setup/dimensions'

export const Game = () => {
  const { bottom } = useViewport()
  const [baseOffset, setBaseOffset] = useState(0)
  const [viewportX, setViewportX] = useState(0)
  const game = useGameResolvers()
  const [state, actions] = useGameState()

  const baseProps = {
    anchor: new Point(0, 1),
    y: Math.max(450, bottom),
  }

  useTick((delta = 0) => {
    const movement = delta
    setBaseOffset(v => (v < -46 ? 0 : v - movement))
    setViewportX(v => v + movement)
  })

  return (
    <>
      <Sprite
        {...baseProps}
        interactive
        pointerdown={() => {
          actions.setFirstName(
            state.user.firstName === 'hello' ? 'world' : 'hello',
          )
        }}
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
      <Bird game={game} />
      <Sprite {...baseProps} x={baseOffset} image={baseImage.src} />
      <Typography x={designWidth / 2} y={designHeight / 2}>
        {state.user.firstName}
      </Typography>
    </>
  )
}
