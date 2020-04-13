import { System, Node, NodeList, keep, Engine } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { Body } from 'matter-js'
import {
  FloatPositionComponent,
  BodyComponent,
  BirdStateMachine,
} from 'components'
import { eachNode } from './systemUtils'

class BirdNode extends Node {
  @keep(BodyComponent)
  public body!: BodyComponent
  @keep(BirdStateMachine)
  public state!: BirdStateMachine
}

class FloatNode extends Node {
  @keep(FloatPositionComponent)
  public start!: FloatPositionComponent

  @keep(BodyComponent)
  public body!: BodyComponent
}

const rotationThreshold = 0

export class MovementSystem extends System {
  public constructor(public viewport: Viewport) {
    super()
  }

  getRotation = (velocity: number) => {
    const rotation = Math.abs(velocity / 8)
    // Moving upwards
    if (velocity < rotationThreshold) return Math.max(-Math.PI / 3, -rotation)
    // Moving downwards
    else if (velocity >= rotationThreshold)
      return Math.min(Math.PI / 2, rotation)
    return 0
  }

  floatNodes!: NodeList<FloatNode>
  birdNodes!: NodeList<BirdNode>
  public addToEngine(engine: Engine) {
    this.floatNodes = engine.getNodeList(FloatNode)
    this.birdNodes = engine.getNodeList(BirdNode)
  }

  timePassed = 0
  getVariation = (timePassed: number) => Math.sin(timePassed / 7 / (1000 / 60))
  getY = (timePassed: number) => -Math.round(this.getVariation(timePassed) * 5)

  update(time: number) {
    eachNode(this.floatNodes, ({ start, body: { body } }) => {
      this.timePassed += time * 1000

      const newPosition = {
        x: body.position.x,
        y: start.y + this.getY(this.timePassed),
      }
      // 'Float' the body
      Body.setPosition(body, newPosition)
    })
    eachNode(this.birdNodes, ({ body: { body }, state }) => {
      if (state.entityStateMachine.name === 'playing') {
        Body.setVelocity(body, { x: 0, y: body.velocity.y })
        Body.setAngle(body, this.getRotation(body.velocity.y))
      }
    })
  }

  public removeFromEngine() {}
}
