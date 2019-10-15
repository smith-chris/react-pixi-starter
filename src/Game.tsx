import React from 'react'

import { center, centerBottom } from 'setup/dimensions'
import { Sprite } from '@inlet/react-pixi'

export const Game = () => (
  <>
    <Sprite
      {...center}
      image={require('assets/sprites/background-day.png').src}
    />
    <Sprite
      {...center}
      image={require('assets/sprites/yellowbird-midflap.png').src}
    />
    <Sprite {...centerBottom} image={require('assets/sprites/base.png').src} />
  </>
)
