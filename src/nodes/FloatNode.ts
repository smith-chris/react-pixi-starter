import { Node, keep } from '@ash.ts/ash'
import { TransformComponent } from '../components'
import { BodyComponent } from 'components/BodyComponent'

export class FloatNode extends Node {
  @keep(TransformComponent)
  public start!: TransformComponent

  @keep(BodyComponent)
  public body!: BodyComponent
}
