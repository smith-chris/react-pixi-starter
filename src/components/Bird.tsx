import React, { useEffect, ComponentProps } from 'react'
import { Sprite, Container, useTick } from '@inlet/react-pixi'
import { GameHook, BirdTexture } from 'hooks/useGameState'
import { Rectangle } from './Rectangle'

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
    <Container position={[bird.x - viewportLeft, bird.y]}>
      <Sprite anchor={0.5} image={textures[textureName]} rotation={rotation} />
      <Rectangle
        alpha={0.5}
        color={0xff9c2b}
        width={texture.width}
        height={texture.height}
        anchor={0.5}
      />
    </Container>
  )
}
