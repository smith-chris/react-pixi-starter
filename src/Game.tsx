import React from 'react'

import { Point } from 'pixi.js'
import { designWidth, designHeight } from 'setup/dimensions'
import { Typography } from 'components/Typography'
import { Minotaur } from 'components/Minotaur'

export const Game = () => (
  <>
    <Minotaur x={300} />
    <Typography y={designHeight * 0.1} anchor={new Point(0, 0.5)}>
      Hello
    </Typography>
  </>
)
