import React from 'react'
import { Point } from 'pixi.js'

import { designWidth, designHeight } from 'setup/dimensions'
import { Typography } from 'components/Typography'
import { Ghost } from 'components/Ghost'
import { AnimatedSprite } from 'components/AnimatedSprite'
import { ghostAnimation } from 'components/animation'

export const Game = () => (
  <>
    <Ghost x={300} />
    <AnimatedSprite animation={ghostAnimation.idle} x={300} y={160} scale={5} />
    <Typography y={designHeight * 0.1} anchor={new Point(0, 0.5)}>
      Hello
    </Typography>
  </>
)
