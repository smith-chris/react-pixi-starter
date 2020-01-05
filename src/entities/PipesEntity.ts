import Phaser, { Scene } from 'phaser'
import { designWidth } from 'setup/dimensions'
import { Update, Responsive } from 'gameState'
import { PlayerEntity } from './PlayerEntity'

export class PipesEntity {
  update: Update
  onCollision = () => {}
  responsive: Responsive

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
    const minAirHeight = 314

    const container = scene.add.container(0, 0)

    this.responsive = ({ base, viewportHeight, extraHeight }) => {
      // const airHeight = viewportHeight - base.top
      container.y = extraHeight
    }

    this.update = (state, { movement }) => {
      if (state.touchable) {
        ;(container.getAll() as Phaser.GameObjects.Sprite[]).forEach(pipe => {
          pipe.x -= movement
        })
      }
      if (state.playing) {
        const objects = container.getAll() as Phaser.GameObjects.Sprite[]
        const lastPipeX = objects.length
          ? objects[objects.length - 1].x
          : -Infinity
        if (lastPipeX < designWidth - pipeDist) {
          objects.forEach(p => {
            if (p.getBounds().right < 0) {
              container.remove(p)
              p.destroy()
            }
          })
          const variation = Math.round(minAirHeight * 0.66)
          const centerY = Math.round(
            minAirHeight / 2 +
              Phaser.Math.Between(-variation / 2, variation / 2),
          )

          const topPipe = scene.physics.add.sprite(
            designWidth,
            centerY - pipeGap / 2,
            'pipe',
          )
          topPipe.setOrigin(0, 1)
          topPipe.flipY = true
          topPipe.setDepth(depth)
          container.add(topPipe)

          const topPipeBody = topPipe.body as Phaser.Physics.Arcade.Body
          topPipeBody.maxVelocity.y = 0
          scene.physics.add.overlap(player.sprite, topPipe, this.onCollision)

          const bottomPipe = scene.physics.add.sprite(
            designWidth,
            centerY + pipeGap / 2,
            'pipe',
          )
          bottomPipe.setOrigin(0, 0)
          bottomPipe.setDepth(depth)
          container.add(bottomPipe)

          const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body
          bottomPipeBody.maxVelocity.y = 0
          scene.physics.add.overlap(player.sprite, bottomPipe, this.onCollision)
        }
      }
    }
  }
}
