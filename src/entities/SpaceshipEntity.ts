import { Entity, EntityStateMachine } from 'ash'
import {
  MotionComponent,
  MotionControlsComponent,
  GunComponent,
  GunControlsComponent,
  CollisionComponent,
  DisplayComponent,
  DeathThroesComponent,
  UpdatableComponent,
  SpaceshipComponent,
  TransformComponent,
  AudioComponent,
} from 'components'
import { Keyboard } from 'const'
import { SpaceshipView, SpaceshipDeathView } from 'graphics'

export const createSpaceship = (x: number, y: number) => {
  const spaceship = new Entity()
  console.log('creating spaceship!')
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
    .add(GunComponent)
    .withInstance(new GunComponent(8, 0, 0.3, 2))
    .add(GunControlsComponent)
    .withInstance(new GunControlsComponent(Keyboard.SPACE))
    .add(CollisionComponent)
    .withInstance(new CollisionComponent(9))
    .add(DisplayComponent)
    .withInstance(new DisplayComponent(new SpaceshipView()))

  const deathView: SpaceshipDeathView = new SpaceshipDeathView()
  entityStateMachine
    .createState('destroyed')
    .add(DeathThroesComponent)
    .withInstance(new DeathThroesComponent(5))
    .add(DisplayComponent)
    .withInstance(new DisplayComponent(deathView))
    .add(UpdatableComponent)
    .withInstance(new UpdatableComponent(deathView))

  spaceship
    .add(new SpaceshipComponent(entityStateMachine))
    .add(new TransformComponent(x, y, 0))
    .add(new AudioComponent())

  entityStateMachine.changeState('playing')
  return spaceship
}
