import { Point, SimplePoint } from './../utils/intersect'
import { TransformComponent } from './../components/TransformComponent'
import { Entity } from '@ash.ts/ash'
import { DisplayComponent, ResizeComponent } from 'components'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies, Body } from 'matter-js'
import {
  centerBottom,
  designHeight,
  designWidth,
  viewportWidth,
} from 'setup/dimensions'
import pipe from 'assets/pipe.png'
import { Sprite } from 'pixi.js'

const fpRatio = designWidth / 288
const pipeDist = Math.round(150 * fpRatio)
const pipeGap = Math.round(110 * fpRatio)
const minAirHeight = Math.round(314 * fpRatio)

const createPipe = ({
  x,
  y,
  anchor,
  type,
}: SimplePoint & { anchor?: SimplePoint; type: 'top' | 'bottom' }) => {
  const entity = new Entity()

  const sprite = Sprite.from(pipe.src)
  sprite.anchor.set(anchor?.x ?? 0, anchor?.y ?? 0)
  if (type === 'top') {
    sprite.scale.set(1, -1)
  }
  entity.add(new DisplayComponent(sprite)).add(
    new BodyComponent(
      Bodies.rectangle(x, y, pipe.width, pipe.height, {
        isStatic: true,
      }),
    ),
  )

  return entity
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const createPipeSet = () => {
  const variation = Math.round(minAirHeight * 0.5)
  const centerY = Math.round(
    minAirHeight / 2 + getRandomInt(-variation / 2, variation / 2),
  )

  const topPipe = createPipe({
    x: designWidth + pipe.width / 2,
    y: centerY - pipeGap / 2 - pipe.height / 2,
    anchor: {
      x: 0.5,
      y: 0.5,
    },
    type: 'top',
  })

  const bottomPipe = createPipe({
    x: designWidth + pipe.width / 2,
    y: centerY + pipeGap / 2 + pipe.height / 2,
    anchor: {
      x: 0.5,
      y: 0.5,
    },
    type: 'bottom',
  })

  return [topPipe, bottomPipe]
}
