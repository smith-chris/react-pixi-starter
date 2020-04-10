import { ListIteratingSystem } from '@ash.ts/ash'
import { UpdatableNode } from 'nodes/UpdatableNode'
import { Viewport } from 'const/types'

export class UpdateSystem extends ListIteratingSystem<UpdatableNode> {
  public constructor(public viewport: Viewport) {
    super(UpdatableNode)
  }

  public updateNode(node: UpdatableNode, time: number): void {
    node.updatable.updatable.update(time, this.viewport)
  }
}
