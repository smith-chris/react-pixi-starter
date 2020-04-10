import { Node, keep } from '@ash.ts/ash'
import { MotionComponent } from 'components'
import { InitialPosition } from 'components/BirdComponents'

export class MovementNode extends Node {
  @keep(InitialPosition)
  public transform!: InitialPosition

  @keep(MotionComponent)
  public motion!: MotionComponent
}
