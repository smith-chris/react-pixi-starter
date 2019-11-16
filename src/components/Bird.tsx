import React, { useEffect, ComponentProps } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import { GameHook, BirdTexture } from 'hooks/useGameState'

const textures: Record<BirdTexture, string> = {
  down: require('assets/sprites/yellowbird-downflap.png').src,
  mid: require('assets/sprites/yellowbird-midflap.png').src,
  up: require('assets/sprites/yellowbird-upflap.png').src,
}

type BirdProps = ComponentProps<typeof Sprite> & {
  game: GameHook
}

export const Bird = ({ game }: BirdProps) => {
  const [
    { textureName, bird, rotation, viewportLeft },
    { onTouch, update },
  ] = game

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
      image={textures[textureName]}
      rotation={rotation}
      position={[bird.x - viewportLeft, bird.y]}
      anchor={new Point(0.5, 0.5)}
    />
  )
}
