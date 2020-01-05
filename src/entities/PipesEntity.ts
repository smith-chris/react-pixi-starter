import { Scene } from 'phaser'
import { designWidth, designHeight } from 'setup/dimensions'
import { Update, Responsive } from 'gameState'
import { PlayerEntity } from './PlayerEntity'

export class PipesEntity {
  update: Update
  onCollision = () => {}
  // responsive: Responsive

  constructor({
    scene,
    player,
    depth = 0,
  }: {
    scene: Scene
    player: PlayerEntity
    depth?: number
  }) {
    const pipeDist = 150
    const pipeGap = 120

    const objects: Phaser.GameObjects.Sprite[] = []

    this.update = (state, { movement }) => {
      if (state.touchable) {
        objects.forEach(pipe => {
          pipe.x -= movement
        })
      }
      if (state.playing) {
        const lastPipeX = objects.length
          ? objects[objects.length - 1].x
          : -Infinity
        if (lastPipeX < designWidth - pipeDist) {
          objects.forEach(p => {
            if (p.getBounds().right < 0) {
              // objects.remove(p)
              p.destroy()
            }
          })
          const variation = 125
          const centerY = Math.round(
            designHeight / 2 + variation * 0.75 - Math.random() * variation,
          )

          const topPipe = scene.physics.add.sprite(
            designWidth,
            centerY - pipeGap / 2,
            'pipe',
          )
          topPipe.setOrigin(0, 1)
          topPipe.flipY = true
          topPipe.setDepth(depth)

          const topPipeBody = topPipe.body as Phaser.Physics.Arcade.Body
          topPipeBody.maxVelocity.y = 0
          objects.push(topPipe)
          scene.physics.add.overlap(player.sprite, topPipe, this.onCollision)

          const bottomPipe = scene.physics.add.sprite(
            designWidth,
            centerY + pipeGap / 2,
            'pipe',
          )
          bottomPipe.setOrigin(0, 0)
          bottomPipe.setDepth(depth)

          const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body
          bottomPipeBody.maxVelocity.y = 0
          objects.push(bottomPipe)
          scene.physics.add.overlap(player.sprite, bottomPipe, this.onCollision)
        }
      }
    }
  }
}
