import { Entity, EntityStateMachine } from 'ash'
import {
  MotionComponent,
  MotionControlsComponent,
  DisplayComponent,
  SpaceshipComponent,
  TransformComponent,
} from 'components'
import { Keyboard } from 'const'
import { SpaceshipView } from 'graphics'

export const createSpaceship = (x: number, y: number) => {
  const spaceship = new Entity()
  const entityStateMachine = new EntityStateMachine(spaceship)

  entityStateMachine
    .createState('playing')
    .add(MotionComponent)
    .withInstance(new MotionComponent(0, 0, 0, 15))
    .add(MotionControlsComponent)
    .withInstance(
      new MotionControlsComponent(
        Keyboard.LEFT,
        Keyboard.RIGHT,
        Keyboard.UP,
        100,
        3,
      ),
    )
    .add(DisplayComponent)
    .withInstance(new DisplayComponent(new SpaceshipView()))

  spaceship
    .add(new SpaceshipComponent(entityStateMachine))
    .add(new TransformComponent(x, y, 0))

  entityStateMachine.changeState('playing')
  return spaceship
}

// How it could look like
const createEntity = (a: any) => a

const entityStateMachine = createEntity({
  states: {
    playing: [
      new MotionComponent(0, 0, 0, 15),
      new MotionControlsComponent(
        Keyboard.LEFT,
        Keyboard.RIGHT,
        Keyboard.UP,
        100,
        3,
      ),
      new DisplayComponent(new SpaceshipView()),
    ],
  },
  components: [new TransformComponent(0, 0, 0)],
})
