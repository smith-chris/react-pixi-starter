import { Node, keep } from '@ash.ts/ash'
import { DisplayComponent } from '../components'
import { BodyComponent } from 'components/BodyComponent'

export class BodyRenderNode extends Node {
  @keep(BodyComponent)
  public body!: BodyComponent

  @keep(DisplayComponent)
  public display!: DisplayComponent
}
