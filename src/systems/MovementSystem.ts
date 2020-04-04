import { ListIteratingSystem } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { MovementNode } from 'nodes'

export class MovementSystem extends ListIteratingSystem<MovementNode> {
  private readonly viewport: Viewport

  public constructor(viewport: Viewport) {
    super(MovementNode)
    this.viewport = viewport
  }

  public updateNode(node: MovementNode, time: number): void {
    const { transform, motion } = node
    const { viewport } = this
    transform.x += motion.velocityX * time
    transform.y += motion.velocityY * time
    // Check if its out of borders and place it accordingly if it is
    if (transform.x < 0) {
      transform.x += viewport.width
    }
    if (transform.x > viewport.width) {
      transform.x -= viewport.width
    }
    if (transform.y < viewport.top) {
      transform.y += viewport.height
    }
    if (transform.y > viewport.bottom) {
      transform.y -= viewport.height
    }
    transform.rotation += motion.angularVelocity * time
    if (motion.damping > 0) {
      const xDamp: number = Math.abs(
        Math.cos(transform.rotation) * motion.damping * time,
      )
      const yDamp: number = Math.abs(
        Math.sin(transform.rotation) * motion.damping * time,
      )
      if (motion.velocityX > xDamp) {
        motion.velocityX -= xDamp
      } else if (motion.velocityX < -xDamp) {
        motion.velocityX += xDamp
      } else {
        motion.velocityX = 0
      }
      if (motion.velocityY > yDamp) {
        motion.velocityY -= yDamp
      } else if (motion.velocityY < -yDamp) {
        motion.velocityY += yDamp
      } else {
        motion.velocityY = 0
      }
    }
  }
}
