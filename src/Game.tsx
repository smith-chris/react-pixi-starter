import React, { useState, Fragment } from 'react'

import { Sprite, useTick } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

import baseImage from 'assets/sprites/base.png'
import { Bird } from 'components/Bird'
import { useGameReducer } from 'hooks/useGameState'
import { Rectangle } from 'components/Rectangle'

const pipeHeight = 100

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
      <Sprite
        {...baseProps}
        interactive
        image={require('assets/sprites/background-day.png').src}
      />
      {state.pipes.map(({ x, y }, i) => (
        <Fragment key={i}>
          <Sprite
            // anchor={[0.5, 0]}
            x={x - state.viewportLeft}
            y={y + pipeHeight / 2}
            image={require('assets/sprites/pipe-green.png').src}
          />
          <Sprite
            // anchor={[0.5, 0]}
            x={x - state.viewportLeft}
            y={y - pipeHeight / 2}
            scale={[1, -1]}
            image={require('assets/sprites/pipe-green.png').src}
          />
          {/* <Rectangle x={x} y={y} width={50} height={pipeHeight} anchor={0.5} /> */}
        </Fragment>
      ))}
      <Bird game={game} />
      <Sprite {...baseProps} x={baseOffset} image={baseImage.src} />
    </>
  )
}
