import { Scene } from 'phaser'
import { designWidth, designHeight } from 'setup/dimensions'
import { Update, Responsive, GameState } from 'gameState'

export class PlayerEntity {
  hit: (state: GameState, right: boolean) => void
  stop: Function
  start: Function
  reset: Function
  jump: Function
  setBottom: (value: number) => void
  update: Update
  sprite: Phaser.Physics.Arcade.Sprite
  responsive: Responsive

  constructor({ scene, depth = 0 }: { scene: Scene; depth?: number }) {
    const startY = designHeight * 0.5
    const startX = designWidth * 0.28

    const container = scene.add.container(0, 0)
    container.setDepth(depth)

    // const group = scene.physics.add.group()
    // const gh = scene.add.sprite(100, 100, 'idle')
    // window.gr = group
    // gh.setScale(2)
    // group.add(gh)

    const ghost = scene.physics.add.sprite(designWidth * 0.5, startY, 'idle')
    // const ghost = scene.physics.add.collider()
    ghost.setScale(2)
    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNames('idle', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    })
    scene.anims.create({
      key: 'float',
      frames: scene.anims.generateFrameNames('float', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    })

    const flappy = false

    let sprite = ghost
    if (flappy) {
      sprite = scene.physics.add.sprite(designWidth * 0.33, startY, 'midflap')
    }
    container.add(sprite)
    this.sprite = sprite

    if (flappy) {
      const circleOffset = {
        x: 8,
        y: 1,
      }
      sprite.setOrigin(
        0.5 + circleOffset.x / 2 / sprite.width,
        0.5 + circleOffset.y / 2 / sprite.height,
      )
      sprite.setCircle(12, circleOffset.x, circleOffset.y)
    }
    const ghCircleOffset = {
      x: 9,
      y: 8,
    }
    // ghost.setOrigin(
    //   0.5 + ghCircleOffset.x / 2 / ghost.width,
    //   0.5 + ghCircleOffset.y / 2 / ghost.height,
    // )
    // ghost.setCircle(8)
    ghost.setCircle(8, ghCircleOffset.x, ghCircleOffset.y)

    const body = sprite.body as Phaser.Physics.Arcade.Body
    // @ts-ignore
    window.sprite = sprite

    const startVelocityY = body.maxVelocity.y

    this.start = () => {
      body.maxVelocity.y = startVelocityY
      ghost.anims.play('float')
      // ghost.setAngle(110)
      // ghost.setAngle(-60)
    }

    this.reset = () => {
      ghost.x = startX
      ghost.y = startY
      sprite.rotation = 0
      ghost.anims.play('idle')
      ghost.setOrigin(0.5)
      // ghost.anims.play('float')
      // ghost.setOrigin(0.4, 0.6)

      // ghost.setTexture('ghost-hit')
      // ghost.setAngle(110)
      // ghost.setAngle(-60)
      // ghost.setRotation(Math.PI * -0.33)
      // ghost.texture.
      // ghost.setOrigin(0)
    }

    this.stop = () => {
      body.maxVelocity.y = 0
      // if (ghost.body) {
      //   // @ts-ignore
      //   ghost.body.maxVelocity.y = 0
      // }
    }
    this.stop()

    const getVariation = (timePassed: number) =>
      Math.sin(timePassed / 7 / (1000 / 60))

    const getY = (timePassed: number) =>
      startY - Math.round(getVariation(timePassed) * 5)

    const rotationThreshold = 0

    const getRotation = (velocity: number) => {
      const rotation = Math.abs(velocity / (flappy ? 500 : 5000))
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

    this.jump = () => {
      body.velocity.y = -300
    }

    const hitVelocityCap = 50
    let xFallDest = 0
    let dieAngle = 0

    this.hit = (state, right) => {
      if (right) {
        ghost.setOrigin(0.3, 0.7)
      }
      let fallMult = right ? 1 : -1
      dieAngle = right ? 110 : -60
      if (body.velocity.y < hitVelocityCap) {
        body.velocity.y = hitVelocityCap
      }
      ghost.anims.stop()
      ghost.setTexture('ghost-hit')
      ghost.setAngle(45)
      xFallDest = Math.round(ghost.x + fallMult * Phaser.Math.Between(30, 50))
      // console.log(right, ghost.x, xFallDest)
    }

    const tween = (current: number, end: number, speed: number) => {
      const dist = end - current
      return current + dist / speed
    }

    const angleStep = 3

    this.update = (state, { timePassed }) => {
      // ghost.rotation += 0.05
      if (state.alive && flappy) {
        const textureName = getTextureName(
          state.playing ? timePassed * 3 : timePassed,
        )
        if (textureName !== sprite.texture.key) {
          // console.log('set texture', textureName)
          sprite.setTexture(textureName)
        }
      }
      if (state.falling) {
        ghost.angle = tween(ghost.angle, dieAngle, 35)
        ghost.x = tween(ghost.x, xFallDest, 35)
      }
      if (!state.playing) {
        // console.log('set y')
        sprite.y = getY(timePassed)
      }
      if (state.playing && !state.falling) {
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
