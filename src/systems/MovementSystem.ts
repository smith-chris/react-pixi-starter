import { System, Node, NodeList, keep, Engine } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { Body } from 'matter-js'
import { FloatPositionComponent, BodyComponent } from 'components'
import { eachNode } from './systemUtils'
import { BirdNode, FloatingBirdNode } from 'entities/BirdEntity'
import { GameStateNode } from 'nodes'

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

  floatingBirdNodes!: NodeList<FloatingBirdNode>
  birdNodes!: NodeList<BirdNode>
  games!: NodeList<GameStateNode>
  public addToEngine(engine: Engine) {
    this.floatingBirdNodes = engine.getNodeList(FloatingBirdNode)
    this.birdNodes = engine.getNodeList(BirdNode)
    this.games = engine.getNodeList(GameStateNode)
  }

  timePassed = 0
  getVariation = (timePassed: number) => Math.sin(timePassed / 7 / (1000 / 60))
  getY = (timePassed: number) => -Math.round(this.getVariation(timePassed) * 5)

  update(time: number) {
    const gameState = this.games?.head
    eachNode(this.floatingBirdNodes, ({ start, body: { body } }) => {
      this.timePassed += time * 1000

      const newPosition = {
        x: body.position.x,
        y: start.y + this.getY(this.timePassed),
      }
      // 'Float' the body
      Body.setPosition(body, newPosition)
    })
    eachNode(this.birdNodes, ({ body: { body }, state }) => {
      if (gameState?.state.playing) {
        console.log('whats up')
        // Body.setVelocity(body, { x: 0, y: body.velocity.y })
        Body.setAngle(body, this.getRotation(body.velocity.y))
      }
    })
  }

  public removeFromEngine() {}
}
