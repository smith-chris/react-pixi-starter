import React, { useState, useRef, useEffect } from 'react'
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

const getY = (variation: number) => designHeight / 2 + Math.round(variation * 5)

export const Bird = ({ x = designWidth / 3 }) => {
  const timePassed = useRef(0)
  const isPlaying2 = useRef(false)
  const [variation, setVariation] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [y, setY] = useState(designHeight / 2)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const touchStart = () => {
      if (!isPlaying2.current) {
        setIsPlaying(true)
        isPlaying2.current = true
        setY(getY(variation))
      }
      setVelocity(6)
    }

    window.addEventListener('pointerdown', touchStart)
    window.addEventListener('touchstart', touchStart)
    return () => {
      window.removeEventListener('pointerdown', touchStart)
      window.removeEventListener('touchstart', touchStart)
    }
  }, [])

  useTick((delta = 0) => {
    timePassed.current += delta
    if (!isPlaying) {
      setVariation(Math.sin(timePassed.current / 7))
    } else {
      if (y > designHeight) {
        setIsPlaying(false)
        isPlaying2.current = false
      }
      setVelocity(v => v - 0.25)
      setY(v => v - velocity)
    }
  })

  return (
    <Sprite
      image={getImage(variation)}
      x={x}
      y={isPlaying ? y : getY(variation)}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
