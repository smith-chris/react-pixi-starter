import React, { useEffect, ComponentProps } from 'react'
import { Sprite, Container, useTick } from '@inlet/react-pixi'
import { GameHook, BirdTexture } from 'hooks/useGameState'
import { Rectangle } from './Rectangle'
import { debug } from 'utils/debug'
import birdTexture from 'assets/sprites/yellowbird-midflap.png'

const textures: Record<BirdTexture, string> = {
  down: require('assets/sprites/yellowbird-downflap.png').src,
  mid: require('assets/sprites/yellowbird-midflap.png').src,
  up: require('assets/sprites/yellowbird-upflap.png').src,
}

const texture = require('assets/sprites/yellowbird-upflap.png')

type BirdProps = ComponentProps<typeof Sprite> & {
  game: GameHook
}

export const Bird = ({ game }: BirdProps) => {
  const [{ textureName, bird, rotation, viewportLeft }, { onTouch }] = game

  useEffect(() => {
    window.addEventListener('pointerdown', onTouch)
    window.addEventListener('touchstart', onTouch)
    return () => {
      window.removeEventListener('pointerdown', onTouch)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [])

  return (
    <Container position={[bird.x - viewportLeft, bird.y]}>
      <Sprite
        image={textures[textureName]}
        rotation={rotation}
        anchor={0.5}
        x={birdTexture.width / 2}
        y={birdTexture.height / 2}
      />
      {debug && (
        <Rectangle
          alpha={0.5}
          color={0xff9c2b}
          width={bird.width}
          height={bird.height}
        />
      )}
    </Container>
  )
}
