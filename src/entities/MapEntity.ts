import { Entity } from '@ash.ts/ash'
import { DisplayComponent, ResizeComponent } from 'components'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies, Body } from 'matter-js'
import { designWidth } from 'setup/dimensions'
import base from 'assets/sprites/base.png'
import { Sprite } from 'pixi.js'

export const createMap = () => {
  const entity = new Entity()

  // 4x bigger height to prevent bird from falling below base on resize
  const heightMultiplier = 4
  const bodyHeight = base.height * heightMultiplier
  const yOffset = bodyHeight / 2 - base.height / 2
  const sprite = Sprite.from(base.src)
  sprite.anchor.set(0.5, 0.5 * heightMultiplier)

  const body = Bodies.rectangle(designWidth / 2, 0, base.width, bodyHeight, {
    isStatic: true,
  })

  entity
    .add(new DisplayComponent(sprite))
    .add(new BodyComponent(body))
    .add(
      new ResizeComponent(({ bottom }) => {
        const newPosition = {
          x: body.position.x,
          y: Math.max(390 + yOffset, bottom),
        }
        Body.setPosition(body, newPosition)
      }),
    )

  return entity
}
