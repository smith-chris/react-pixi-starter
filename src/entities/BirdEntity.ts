import { Entity, EntityStateMachine, keep, Node } from '@ash.ts/ash'
import { DisplayComponent } from 'components'
import { BirdView } from 'graphics/BirdView'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies } from 'matter-js'
import { designHeight, designWidth } from 'setup/dimensions'
import ship from 'assets/ship.png'
import { BodyDefinitionComponent } from 'components/BodyDefinitionComponent'
import {
  BirdStateMachine,
  FloatPositionComponent,
} from 'components/BirdComponents'

export class BirdNode extends Node {
  @keep(BirdStateMachine)
  public state!: BirdStateMachine

  @keep(BodyComponent)
  public body!: BodyComponent
}


export class FloatingBirdNode extends Node {
  @keep(FloatPositionComponent)
  public start!: FloatPositionComponent

  @keep(BodyComponent)
  public body!: BodyComponent
}

export const createBird = () => {
  const entity = new Entity()
  const entityStateMachine = new EntityStateMachine(entity)

  // Could be part of InitialPositionComponent
  const startY = designHeight * 0.5
  const startX = designWidth * 0.28

  console.log('entity 1')
  try {
    const birdDisplayComponent = new DisplayComponent(new BirdView(ship))
    entity
      .add(birdDisplayComponent)
      .add(
        new BodyComponent(
          Bodies.rectangle(startX, startY, ship.width, ship.height),
        ),
      )

    // birdDisplayComponent.object.scale.x = 0.5

    console.log('entity 2')
    entityStateMachine
      .createState('floating')
      .add(FloatPositionComponent)
      .withInstance(new FloatPositionComponent(startX, startY))
      .add(BodyDefinitionComponent)
      .withInstance(
        new BodyDefinitionComponent({
          isStatic: true,
        }),
      )

    console.log('entity 3')
    entityStateMachine
      .createState('playing')
      .add(BodyDefinitionComponent)
      .withInstance(
        new BodyDefinitionComponent({
          isStatic: false,
        }),
      )
  } catch (err) {
    console.log('Err', err.message)
  }

  console.log('entity 4')
  entity.add(new BirdStateMachine(entityStateMachine))
  entityStateMachine.changeState('floating')

  return entity
}

// How it could look like
const createEntity = (a: any) => a
const texture = (a: any) => a
const bodyDefinition = (a?: any) => a

const entityStateMachine = createEntity({
  components: [
    // This way we are not strictly tied to pixi
    // texture('assets/sprites/yellowbird-midflap.png'),
    // or assets.texture('midflap')
    bodyDefinition({
      restitution: 0.8,
      isStatic: true,
    }),
  ],
  states: {
    playing: [
      // Overrides the texture component only under 'playing' state
      // texture('assets/sprites/yellowbird-downflap.png'),
      bodyDefinition({ isStatic: false }),
    ],
  },
})
