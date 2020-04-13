import { ListIteratingSystem, Node, keep } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { Body } from 'matter-js'
import { FloatPosition, BodyComponent } from 'components'

 class FloatNode extends Node {
  @keep(FloatPosition)
  public start!: FloatPosition

  @keep(BodyComponent)
  public body!: BodyComponent
}

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
