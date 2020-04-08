import { Entity } from 'ash'
import { DisplayComponent } from 'components'
import { BirdView } from 'graphics/BirdView'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies } from 'matter-js'
import { designHeight, designWidth } from 'setup/dimensions'
import midflap from 'assets/sprites/yellowbird-midflap.png'

export const createBird = (x: number, y: number) => {
  const entity = new Entity()

  const startY = designHeight * 0.5
  const startX = designWidth * 0.28

  entity.add(new DisplayComponent(new BirdView())).add(
    new BodyComponent(
      Bodies.rectangle(startX, startY, midflap.width, midflap.height, {
        restitution: 0.8,
        // isStatic: true,
      }),
    ),
  )

  return entity
}
