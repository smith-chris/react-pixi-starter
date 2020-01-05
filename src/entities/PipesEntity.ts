import Phaser, { Scene } from 'phaser'
import { designWidth } from 'setup/dimensions'
import { Update, Responsive } from 'gameState'
import { PlayerEntity } from './PlayerEntity'

export class PipesEntity {
  update: Update
  reset: Function
  onCollision = () => {}
  onScore = () => {}
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
    const pipeGap = 110
    const minAirHeight = 314

    const container = scene.add.container(0, 0)

    this.responsive = ({ base, viewportHeight, extraHeight }) => {
      // const airHeight = viewportHeight - base.top
      container.y = extraHeight
    }

    this.reset = () => {
      const objects = container.getAll() as Phaser.GameObjects.Sprite[]
      objects.forEach(p => {
        container.remove(p)
        p.destroy()
      })
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
        objects.forEach(p => {
          if (
            // @ts-ignore
            !p._isScored &&
            // @ts-ignore
            p._isBottom &&
            p.getBounds().left + p.width / 2 < player.sprite.getBounds().right
          ) {
            // @ts-ignore
            p._isScored = true
            this.onScore()
          }
          if (p.getBounds().right < 0) {
            container.remove(p)
            p.destroy()
          }
        })
        if (lastPipeX < designWidth - pipeDist) {
          const variation = Math.round(minAirHeight * 0.5)
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
          // @ts-ignore
          bottomPipe._isBottom = true
          container.add(bottomPipe)

          const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body
          bottomPipeBody.maxVelocity.y = 0
          scene.physics.add.overlap(player.sprite, bottomPipe, this.onCollision)
        }
      }
    }
  }
}
