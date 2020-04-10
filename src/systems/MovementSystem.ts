import { ListIteratingSystem } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { FloatNode } from 'nodes/FloatNode'
import { Body } from 'matter-js'

export class MovementSystem extends ListIteratingSystem<FloatNode> {
  public constructor(public viewport: Viewport) {
    super(FloatNode)
  }

  timePassed = 0
  getVariation = (timePassed: number) => Math.sin(timePassed / 7 / (1000 / 60))
  getY = (timePassed: number) => -Math.round(this.getVariation(timePassed) * 5)

  public updateNode({ start, body: { body } }: FloatNode, time: number): void {
    this.timePassed += time * 1000

    const newPosition = {
      x: body.position.x,
      y: start.y + this.getY(this.timePassed),
    }
    Body.setPosition(body, newPosition)
  }
}
