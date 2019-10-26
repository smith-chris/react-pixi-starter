import React, { useEffect } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import { designWidth, designHeight } from 'setup/dimensions'
import { makeResolvers } from 'zolve'

const down = require('assets/sprites/yellowbird-downflap.png').src
const mid = require('assets/sprites/yellowbird-midflap.png').src
const up = require('assets/sprites/yellowbird-upflap.png').src

const getVariation = (timePassed: number) => Math.sin(timePassed / 7)

const getImage = (timePassed: number) => {
  const v = getVariation(timePassed)
  if (v > 0.33) return up
  if (v < -0.33) return down
  return mid
}

const getY = (timePassed: number) =>
  designHeight / 2 + Math.round(getVariation(timePassed) * 5)

const getRotation = (velocity: number) => {
  // Moving upwards
  if (velocity > 0) return Math.max(-0.5, -velocity / 10)
  // Moving downwards
  else if (velocity < 0) return Math.min(1.5, -velocity / 10)
  return 0
}

const useBirdResolvers = makeResolvers(
  {
    onTouch: state => () => {
      let { isPlaying, y } = state
      if (!isPlaying) {
        isPlaying = true
        y = getY(state.timePassed)
      }
      return { ...state, isPlaying, y, velocity: 6 }
    },
    update: state => (delta = 0) => {
      let { velocity, timePassed, y, isPlaying } = state
      timePassed += delta
      if (isPlaying) {
        if (y > designHeight) {
          isPlaying = false
        }
        velocity -= 0.25
        y -= velocity
      }
      return { ...state, velocity, timePassed, y, isPlaying }
    },
  },
  {
    isPlaying: false,
    velocity: 0,
    timePassed: 0,
    y: designHeight / 2,
  },
)

export const Bird = ({ x = designWidth / 3 }) => {
  const [
    { timePassed, isPlaying, y, velocity },
    { onTouch, update },
  ] = useBirdResolvers()

  useEffect(() => {
    window.addEventListener('pointerdown', onTouch)
    window.addEventListener('touchstart', onTouch)
    return () => {
      window.removeEventListener('pointerdown', onTouch)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [])

  useTick(update)

  return (
    <Sprite
      image={getImage(timePassed)}
      rotation={isPlaying ? getRotation(velocity) : 0}
      x={x}
      y={isPlaying ? y : getY(timePassed)}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
