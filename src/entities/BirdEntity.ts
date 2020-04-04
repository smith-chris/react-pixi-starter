import { Entity } from 'ash'
import { DisplayComponent, TransformComponent } from 'components'
import { BirdView } from 'graphics/BirdView'

export const createBird = (x: number, y: number) => {
  const entity = new Entity()

  entity
    .add(new TransformComponent(x, y, 0))
    .add(new DisplayComponent(new BirdView()))

  return entity
}
