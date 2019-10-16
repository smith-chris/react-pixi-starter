import React, { useState, useRef, useEffect } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import { designWidth, designHeight } from 'setup/dimensions'
import { useResolvers } from 'hooks/useResolvers'

const down = require('assets/sprites/yellowbird-downflap.png').src
const mid = require('assets/sprites/yellowbird-midflap.png').src
const up = require('assets/sprites/yellowbird-upflap.png').src

const getImage = (v: number) => {
  if (v > 0.33) return up
  if (v < -0.33) return down
  return mid
}

const getY = (variation: number) => designHeight / 2 + Math.round(variation * 5)

const initialState = {
  isPlaying: false,
  variation: 0,
  velocity: 0,
  timePassed: 0,
  y: designHeight / 2,
}

type State = typeof initialState

const birdResolvers = {
  onTouch: (state: State) => (): State => {
    let { isPlaying, y } = state
    if (!isPlaying) {
      isPlaying = true
      y = getY(state.variation)
    }
    return { ...state, isPlaying, y, velocity: 6 }
  },
  update: (state: State) => (delta = 0): State => {
    let { velocity, timePassed, y, variation, isPlaying } = state
    timePassed += delta
    if (!isPlaying) {
      variation = Math.sin(timePassed / 7)
    } else {
      if (y > designHeight) {
        isPlaying = false
      }
      velocity -= 0.25
      y -= velocity
    }
    return { ...state, velocity, timePassed, y, variation, isPlaying }
  },
}

export const Bird = ({ x = designWidth / 3 }) => {
  const [{ variation, isPlaying, y }, { onTouch, update }] = useResolvers(
    birdResolvers,
    initialState,
  )

  useEffect(() => {
    const touchStart = () => {
      onTouch()
    }

    window.addEventListener('pointerdown', touchStart)
    window.addEventListener('touchstart', touchStart)
    return () => {
      window.removeEventListener('pointerdown', touchStart)
      window.removeEventListener('touchstart', touchStart)
    }
  }, [])

  useTick(update)

  return (
    <Sprite
      image={getImage(variation)}
      x={x}
      y={isPlaying ? y : getY(variation)}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
