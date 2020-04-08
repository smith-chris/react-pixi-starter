import { Node, keep } from '@ash.ts/ash'
import { BodyComponent } from 'components/BodyComponent'
import { BodyDefinitionComponent } from 'components/BodyDefinitionComponent'

export class BodyDefinitionNode extends Node {
  @keep(BodyComponent)
  public body!: BodyComponent

  @keep(BodyDefinitionComponent)
  public definition!: BodyDefinitionComponent
}
