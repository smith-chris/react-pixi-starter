import React, { useState, Fragment } from 'react'

import { Sprite, useTick } from '@inlet/react-pixi'
import { useViewport } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

import baseImage from 'assets/sprites/base.png'
import { Bird } from 'components/Bird'
import { useGameReducer, pipeGap } from 'hooks/useGameState'
import { Rectangle } from 'components/Rectangle'
import { Typography } from 'components/Typography'
import { designWidth, designHeight } from 'setup/dimensions'

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
            y={y + pipeGap / 2}
            image={require('assets/sprites/pipe-green.png').src}
          />
          <Sprite
            // anchor={[0.5, 0]}
            x={x - state.viewportLeft}
            y={y - pipeGap / 2}
            scale={[1, -1]}
            image={require('assets/sprites/pipe-green.png').src}
          />
          {/* <Rectangle x={x} y={y} width={50} height={pipeHeight} anchor={0.5} /> */}
        </Fragment>
      ))}
      <Bird game={game} />
      <Typography anchor={0.5} x={designWidth / 2} y={designHeight / 10}>
        Score: {state.score}
      </Typography>
      <Sprite {...baseProps} x={baseOffset} image={baseImage.src} />
    </>
  )
}
