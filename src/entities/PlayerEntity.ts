import { Scene } from 'phaser'
import { designWidth, designHeight } from 'setup/dimensions'
import { Update, Responsive } from 'gameState'

export class PlayerEntity {
  hit: Function
  stop: Function
  start: Function
  jump: Function
  setBottom: (value: number) => void
  update: Update
  sprite: Phaser.Physics.Arcade.Sprite
  responsive: Responsive

  constructor({ scene, depth = 0 }: { scene: Scene; depth?: number }) {
    const startY = designHeight * 0.5

    const container = scene.add.container(0, 0)
    container.setDepth(depth)

    const sprite = scene.physics.add.sprite(
      designWidth * 0.33,
      startY,
      'midflap',
    )
    container.add(sprite)
    this.sprite = sprite

    const circleOffset = {
      x: 8,
      y: 1,
    }
    sprite.setOrigin(
      0.5 + circleOffset.x / 2 / sprite.width,
      0.5 + circleOffset.y / 2 / sprite.height,
    )
    sprite.setCircle(12, circleOffset.x, circleOffset.y)

    const body = sprite.body as Phaser.Physics.Arcade.Body
    // @ts-ignore
    window.sprite = sprite

    const startVelocityY = body.maxVelocity.y
    body.maxVelocity.y = 0

    const getVariation = (timePassed: number) =>
      Math.sin(timePassed / 7 / (1000 / 60))

    const getY = (timePassed: number) =>
      startY - Math.round(getVariation(timePassed) * 5)

    const rotationThreshold = 0

    const getRotation = (velocity: number) => {
      const rotation = Math.abs(velocity / 500)
      // Moving upwards
      if (velocity < rotationThreshold) return Math.max(-Math.PI / 3, -rotation)
      // Moving downwards
      else if (velocity >= rotationThreshold)
        return Math.min(Math.PI / 2, rotation)
      return 0
    }

    const getTextureName = (timePassed: number) => {
      const v = getVariation(timePassed)
      if (v > 0.33) return 'upflap'
      if (v < -0.33) return 'downflap'
      return 'midflap'
    }

    this.responsive = ({ extraHeight }) => {
      container.y = extraHeight
    }

    this.setBottom = value => {
      sprite.y = value - container.y - sprite.height / 3
    }

    this.start = () => {
      body.maxVelocity.y = startVelocityY
    }

    this.stop = () => {
      body.maxVelocity.y = 0
    }

    this.jump = () => {
      body.velocity.y = -300
    }

    const hitVelocityCap = -100
    this.hit = () => {
      if (body.velocity.y < hitVelocityCap) {
        body.velocity.y = hitVelocityCap
      }
    }

    const angleStep = 3

    this.update = (state, { timePassed }) => {
      if (state.alive) {
        const textureName = getTextureName(
          state.playing ? timePassed * 3 : timePassed,
        )
        if (textureName !== sprite.texture.key) {
          sprite.setTexture(textureName)
        }
      }
      if (!state.playing) {
        sprite.y = getY(timePassed)
      }
      if (state.playing) {
        if (state.alive) {
          const newRotation = getRotation(sprite.body.velocity.y)
          const rotationDegrees = newRotation * (180 / Math.PI)
          const rotationDegreesClapmed =
            Math.round(rotationDegrees / angleStep) * angleStep
          sprite.angle = rotationDegreesClapmed
          // sprite.rotation = getRotation(sprite.body.velocity.y)
        }
      }
    }
  }
}
