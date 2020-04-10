import { Entity, EntityStateMachine, keep, Node } from 'ash'
import { DisplayComponent } from 'components'
import { BirdView } from 'graphics/BirdView'
import { BodyComponent } from 'components/BodyComponent'
import { Bodies } from 'matter-js'
import { designHeight, designWidth } from 'setup/dimensions'
import midflap from 'assets/sprites/yellowbird-midflap.png'
import { BodyDefinitionComponent } from 'components/BodyDefinitionComponent'
import { BirdStateMachine, InitialPosition } from 'components/BirdComponents'

export class BirdNode extends Node {
  @keep(BirdStateMachine)
  public state!: BirdStateMachine

  @keep(BodyComponent)
  public body!: BodyComponent
}

export const createBird = () => {
  const entity = new Entity()
  const entityStateMachine = new EntityStateMachine(entity)

  // Could be part of InitialPositionComponent
  const startY = designHeight * 0.5
  const startX = designWidth * 0.28

  entity
    .add(new DisplayComponent(new BirdView()))
    .add(
      new BodyComponent(
        Bodies.rectangle(startX, startY, midflap.width, midflap.height),
      ),
    )

  entityStateMachine
    .createState('floating')
    .add(InitialPosition)
    // How could we have multiple transform components on an entity? (named flavours?)
    .withInstance(new InitialPosition(startX, startY))
    .add(BodyDefinitionComponent)
    .withInstance(
      new BodyDefinitionComponent({
        isStatic: true,
      }),
    )

  entityStateMachine
    .createState('playing')
    .add(BodyDefinitionComponent)
    .withInstance(
      new BodyDefinitionComponent({
        isStatic: false,
      }),
    )

  entity.add(new BirdStateMachine(entityStateMachine))
  entityStateMachine.changeState('floating')

  return entity
}

// How it could look like
const createEntity = (a: any) => a
const texture = (a: any) => a
const bodyDefinition = (a?: any) => a

// @ts-ignore
const entityStateMachine = createEntity({
  components: [
    // This way we are not strictly tied to pixi
    texture('assets/sprites/yellowbird-midflap.png'),
    // or assets.texture('midflap')
    bodyDefinition({
      restitution: 0.8,
      isStatic: true,
    }),
  ],
  states: {
    playing: [
      // Overrides the texture component only under 'playing' state
      texture('assets/sprites/yellowbird-downflap.png'),
      bodyDefinition({ isStatic: false }),
    ],
  },
})
