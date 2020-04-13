import { ListIteratingSystem, keep, Node } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { UpdateComponent } from 'components'

class UpdatableNode extends Node {
  @keep(UpdateComponent)
  public updatable!: UpdateComponent
}

export class UpdateSystem extends ListIteratingSystem<UpdatableNode> {
  public constructor(public viewport: Viewport) {
    super(UpdatableNode)
  }

  public updateNode(node: UpdatableNode, time: number): void {
    node.updatable.update(time, this.viewport)
  }
}
