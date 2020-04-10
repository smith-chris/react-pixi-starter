import { keep, Node } from '@ash.ts/ash'
import { Viewport } from 'const/types'

export class ResizeComponent {
  public constructor(public handler: (viewport: Viewport) => void) {}
}

export class ResizeNode extends Node {
  @keep(ResizeComponent)
  public node!: ResizeComponent
}
