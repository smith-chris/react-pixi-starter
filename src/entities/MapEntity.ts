import { TransformComponent } from './../components/TransformComponent'
import { Entity } from '@ash.ts/ash'
import { DisplayComponent, ResizeComponent } from 'components'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies, Body } from 'matter-js'
import { centerBottom, designWidth, viewportWidth } from 'setup/dimensions'
import bg from 'assets/bg.png'
import { Sprite } from 'pixi.js'

export const createMap = () => {
  const entity = new Entity()

  // 4x bigger height to prevent bird from falling below base on resize
  // const heightMultiplier = 4
  // const bodyHeight = bg.height * heightMultiplier
  // const yOffset = bodyHeight / 2 - bg.height / 2
  const sprite = Sprite.from(bg.src)
  sprite.anchor.set(0.5, 0)

  // const body = Bodies.rectangle(designWidth / 2, 0, bg.width, bodyHeight, {
  //   isStatic: true,
  // })

  const transform = new TransformComponent(centerBottom.x, centerBottom.y)

  entity
    .add(new DisplayComponent(sprite))
    .add(transform)
    // .add(new BodyComponent(body))
    .add(
      new ResizeComponent(({ top }) => {
        transform.y = top
        // console.log('resize', bottom)
        // const newPosition = {
        //   x: body.position.x,
        //   y: Math.max(390 + yOffset, bottom),
        // }
        // Body.setPosition(body, newPosition)
      }),
    )

  return entity
}
