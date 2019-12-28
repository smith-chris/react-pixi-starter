import React, { useState } from 'react'

import { Sprite, useTick, Container } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

import baseImage from 'assets/sprites/base.png'
import { Bird } from 'components/Bird'
import { useGameReducer, pipeGap, pipeWidth } from 'hooks/useGameState'
import { Rectangle } from 'components/Rectangle'
import { Typography } from 'components/Typography'
import { designWidth, designHeight } from 'setup/dimensions'
import { debug } from './utils/const'
import pipeTexture from 'assets/sprites/pipe-green.png'
import backgroundTexture from 'assets/sprites/background-day.png'

export const Game = () => {
  const { bottom } = useViewport()
  const [baseOffset, setBaseOffset] = useState(0)
  const game = useGameReducer()
  const [state] = game

  const baseProps = {
    anchor: new Point(0, 1),
    y: Math.max(450, bottom),
  }

  useTick((delta = 0) => {
    const movement = delta
    setBaseOffset(v => (v < -46 ? 0 : v - movement))
  })

  return (
    <>
      <Sprite {...baseProps} interactive image={backgroundTexture.src} />
      {state.pipes.map(({ center, down, up }, i) => (
        <Container key={i} x={center.x - state.viewportLeft}>
          <Sprite
            y={up.y}
            anchor={[0, 1]}
            scale={[1, -1]}
            image={pipeTexture.src}
          />
          <Sprite y={down.y} image={pipeTexture.src} />
          {debug && <Rectangle alpha={0.5} color={0xff9c2b} {...down} />}
          {debug && <Rectangle alpha={0.5} color={0xff9c2b} {...up} />}
        </Container>
      ))}
      <Bird game={game} />
      <Typography anchor={0.5} x={designWidth / 2} y={designHeight / 10}>
        Score: {state.score}
      </Typography>
      <Sprite {...baseProps} x={baseOffset} image={baseImage.src} />
    </>
  )
}
