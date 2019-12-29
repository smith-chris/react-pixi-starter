import React, { useEffect } from 'react'
import { Axes, World } from 'matter-js'

import { Sprite, useTick, Container } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'

import baseTexture from 'assets/sprites/base.png'
import { Bird } from 'components/Bird'
import { useGameReducer } from 'hooks/useGameState'
import { Rectangle } from 'components/Rectangle'
import { Typography } from 'components/Typography'
import { designWidth, designHeight } from 'setup/dimensions'
import { debug } from './utils/debug'
import pipeTexture from 'assets/sprites/pipe-green.png'
import backgroundTexture from 'assets/sprites/background-day.png'

export const Game = () => {
  const viewport = useViewport()
  const game = useGameReducer()
  const [{ base }, { update, onViewportChange }] = game
  const [state] = game

  useTick(update)

  useEffect(() => {
    onViewportChange(viewport)
  }, [viewport])

  return (
    <>
      <Sprite {...base} interactive image={backgroundTexture.src} />
      {state.pipes.map(({ center, down, up }, i) => (
        <Container key={i} x={center.x - state.viewportLeft}>
          <Sprite
            y={up.y}
            anchor={[0, 1]}
            scale={[1, -1]}
            image={pipeTexture.src}
          />
          <Sprite y={down.y} image={pipeTexture.src} />
          {debug && <Rectangle alpha={0.5} color={0xff9c2b} {...down} x={0} />}
          {debug && <Rectangle alpha={0.5} color={0xff9c2b} {...up} x={0} />}
        </Container>
      ))}
      <Bird game={game} />
      <Typography anchor={0.5} x={designWidth / 2} y={designHeight / 10}>
        Score: {state.score}
      </Typography>
      <Sprite {...base} x={base.offset} image={baseTexture.src} />
      {debug && (
        <Rectangle
          alpha={0.5}
          color={0xfa0c2c}
          {...base}
          width={baseTexture.width}
          height={baseTexture.height}
        />
      )}
    </>
  )
}
