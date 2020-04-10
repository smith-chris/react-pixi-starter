import { Node, keep } from '@ash.ts/ash'
import { BodyComponent } from 'components/BodyComponent'
import { InitialPosition } from 'components/BirdComponents'

export class FloatNode extends Node {
  @keep(InitialPosition)
  public start!: InitialPosition

  @keep(BodyComponent)
  public body!: BodyComponent
}
