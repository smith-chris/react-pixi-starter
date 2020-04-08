import { Node, keep } from '@ash.ts/ash'
import { TransformComponent, StateMachineComponent } from '../components'

export class SpaceshipNode extends Node {
  @keep(StateMachineComponent)
  public spaceship!: StateMachineComponent

  @keep(TransformComponent)
  public transform!: TransformComponent
}
