import React, { useState, useRef } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import { designWidth, designHeight } from 'setup/dimensions'

const down = require('assets/sprites/yellowbird-downflap.png').src
const mid = require('assets/sprites/yellowbird-midflap.png').src
const up = require('assets/sprites/yellowbird-upflap.png').src

const getImage = (v: number) => {
  if (v > 0.33) return up
  if (v < -0.33) return down
  return mid
}

export const Bird = ({ x = designWidth / 3, y = designHeight / 2 }) => {
  const [variation, setVariation] = useState(0)
  const timePassed = useRef(0)

  useTick((delta = 0) => {
    timePassed.current += delta
    setVariation(Math.sin(timePassed.current / 7))
  })

  return (
    <Sprite
      image={getImage(variation)}
      x={x}
      y={y + Math.round(variation * 5)}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
