import { System, Node, NodeList, keep, Engine } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import Matter, { Body } from 'matter-js'
import { FloatPositionComponent, BodyComponent } from 'components'
import { eachNode } from './systemUtils'
import { BirdNode, FloatingBirdNode } from 'entities/BirdEntity'
import { GameStateNode } from 'nodes'
import { PipeNode } from 'entities/PipeSetEntity'
import { designWidth } from 'setup/dimensions'

const fpRatio = designWidth / 288
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
  pipeNodes!: NodeList<PipeNode>
  games!: NodeList<GameStateNode>
  public addToEngine(engine: Engine) {
    this.floatingBirdNodes = engine.getNodeList(FloatingBirdNode)
    this.birdNodes = engine.getNodeList(BirdNode)
    this.games = engine.getNodeList(GameStateNode)
    this.pipeNodes = engine.getNodeList(PipeNode)
  }

  timePassed = 0
  getVariation = (timePassed: number) => Math.sin(timePassed / 7 / (1000 / 60))
  getY = (timePassed: number) => -Math.round(this.getVariation(timePassed) * 5)

  update(time: number) {
    const gameState = this.games?.head
    this.timePassed += time * 1000
    eachNode(this.floatingBirdNodes, ({ start, body: { body } }) => {
      const newPosition = {
        x: body.position.x,
        y: start.y + this.getY(this.timePassed),
      }
      // 'Float' the body
      Body.setPosition(body, newPosition)
    })
    eachNode(this.pipeNodes, ({ body: { body } }) => {
      const px = (time * 1000) / (1000 / 60)
      const movement = Math.round(2 * px * fpRatio)
      const newPositionX = body.position.x - movement
      Matter.Body.set(body, 'position', {
        x: newPositionX,
        y: body.position.y,
      })
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
