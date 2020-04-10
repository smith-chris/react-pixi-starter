import { Entity } from 'ash'
import { DisplayComponent } from 'components'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies, Body } from 'matter-js'
import { designWidth } from 'setup/dimensions'
import base from 'assets/sprites/base.png'
import { Sprite } from 'pixi.js'
import { ResizeComponent } from 'nodes/ResizeNode'

export const createMap = () => {
  const entity = new Entity()

  const sprite = Sprite.from(base.src)
  sprite.anchor.set(0.5)

  const body = Bodies.rectangle(designWidth / 2, 0, base.width, base.height, {
    isStatic: true,
  })

  entity
    .add(new DisplayComponent(sprite))
    .add(new BodyComponent(body))
    .add(
      new ResizeComponent(({ bottom }) => {
        const newPosition = {
          x: body.position.x,
          y: Math.max(450, bottom),
        }
        Body.setPosition(body, newPosition)
      }),
    )

  return entity
}
