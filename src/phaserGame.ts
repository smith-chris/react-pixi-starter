import Phaser from 'phaser'
import { getSizeProps } from 'setup/getSizeProps'
import { designWidth, designHeight, minHeight } from 'setup/dimensions'
import { debug } from 'utils/debug'

type Listener = (v: ReturnType<typeof getSizeProps>) => void
const listeners: Listener[] = []

const responsive = (listener: Listener) => {
  listeners.push(listener)
  listener(
    getSizeProps({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  )
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement

class GameScene extends Phaser.Scene {
  map!: Phaser.GameObjects.Container
  player!: Phaser.Physics.Arcade.Sprite
  base!: Phaser.Physics.Arcade.Sprite
  pipes!: Phaser.Physics.Arcade.Group
  state = {
    playing: false,
    touchable: true,
    alive: true,
  }
  debugLines?: Phaser.GameObjects.Graphics

  constructor() {
    super('GameScene')
  }
  preload() {
    this.load.image('background-day', 'assets/sprites/background-day.png')
    this.load.image('base', 'assets/sprites/base.png')
    this.load.image('midflap', 'assets/sprites/yellowbird-midflap.png')
    this.load.image('upflap', 'assets/sprites/yellowbird-upflap.png')
    this.load.image('downflap', 'assets/sprites/yellowbird-downflap.png')
    this.load.image('pipe', 'assets/sprites/pipe-green.png')
  }
  create() {
    const bg = this.add.image(0, 0, 'background-day').setOrigin(0, 1)
    this.map = this.add.container(0, 0)

    const player = this.physics.add.sprite(
      designWidth / 3,
      designHeight / 2,
      'midflap',
    )
    const circleOffset = {
      x: 8,
      y: 1,
    }
    player.setOrigin(
      0.5 + circleOffset.x / 2 / player.width,
      0.5 + circleOffset.y / 2 / player.height,
    )
    player.setCircle(12, circleOffset.x, circleOffset.y)
    // player.rotation = 10
    // player.body.setMass(Number.MAX_SAFE_INTEGER)
    // playerBody.onCollide()

    const playerBody = player.body as Phaser.Physics.Arcade.Body
    this.player = player
    // @ts-ignore
    window.player = player
    playerBody.maxVelocity.y = 0
    this.map.add(player)

    this.pipes = this.physics.add.group({
      velocityX: -100,
    })
    // this.physics.add.collider(player, this.pipes)
    this.physics.add.overlap(player, this.pipes, this.onPipeCollision)

    const base = this.physics.add.sprite(0, 0, 'base').setOrigin(0, 1)
    // Make it static
    base.setMaxVelocity(0)
    base.setImmovable(true)
    this.base = base
    this.children.bringToTop(base)
    // this.physics.add.collider(player, base)
    this.physics.add.overlap(player, base, this.onBaseCollision)

    this.input.on('pointerdown', this.onTouch)

    if (debug) {
      // The design viewport
      this.debugLines = this.add
        .graphics()
        .lineStyle(2, 0xff0000, 0.75)
        .strokeRect(0, 0, designWidth, designHeight)
        .lineStyle(2, 0xfffb00, 0.75)
        .strokeRect(0, (designHeight - minHeight) / 2, designWidth, minHeight)
      // this.map.add(debugLines)
    }

    responsive(({ stage }) => {
      const extraHeight = stage.position.y / stage.scale.y
      const bottom = designHeight + extraHeight
      const top = -extraHeight
      this.map.y = extraHeight
      const baseBottom = Math.max(450, bottom) + extraHeight
      bg.setY(baseBottom)
      base.setY(baseBottom)
      if (this.debugLines) {
        this.debugLines.y = extraHeight
      }
    })
  }

  onPipeCollision = () => {
    this.pipes.setVelocityX(0)
    this.state.touchable = false
  }

  onBaseCollision = () => {
    this.player.setMaxVelocity(0)
    this.state.alive = false
  }

  onTouch = () => {
    if (!this.state.touchable) {
      return
    }
    if (!this.state.playing) {
      this.state.playing = true
      // @ts-ignore
      this.player.body.maxVelocity.y = this.player.body.maxVelocity.x
    }
    this.player.setVelocityY(-300)
  }

  pipeDist = 150
  pipeGap = debug ? 120 : 120

  getVariation = (timePassed: number) => Math.sin(timePassed / 7 / (1000 / 60))

  getY = (timePassed: number) =>
    designHeight / 2 -
    this.player.height / 2 +
    Math.round(this.getVariation(timePassed) * 5)

  getRotation = (velocity: number) => {
    // Moving upwards
    if (velocity < 0) return Math.max(-0.5, velocity / 500)
    // Moving downwards
    else if (velocity > 0) return Math.min(1.5, velocity / 500)
    return 0
  }

  getTextureName = (timePassed: number) => {
    const v = this.getVariation(timePassed)
    if (v > 0.33) return 'upflap'
    if (v < -0.33) return 'downflap'
    return 'midflap'
  }

  update(timePassed: number, delta: number) {
    const px = delta / (1000 / 60)
    // this.player.rotation += px / 100
    if (this.state.alive) {
      const textureName = this.getTextureName(
        this.state.playing ? timePassed * 3 : timePassed,
      )
      if (textureName !== this.player.texture.key) {
        this.player.setTexture(textureName)
      }
    }
    if (!this.state.playing) {
      this.player.y = this.getY(timePassed)
    }
    if (this.state.playing) {
      if (this.state.alive) {
        this.player.rotation = this.getRotation(this.player.body.velocity.y)
      }

      const pipeSprites = this.pipes.getChildren() as Phaser.Physics.Arcade.Sprite[]
      const lastPipeX = pipeSprites.length
        ? pipeSprites[pipeSprites.length - 1].x
        : -Infinity
      if (lastPipeX < designWidth - this.pipeDist) {
        pipeSprites.forEach(p => {
          if (p.getBounds().right < 0) {
            this.pipes.remove(p)
            p.destroy()
          }
        })
        const variation = 125
        const centerY = Math.round(
          designHeight / 2 + variation * 0.75 - Math.random() * variation,
        )

        const topPipe = this.physics.add.sprite(
          designWidth,
          centerY - this.pipeGap / 2,
          'pipe',
        )
        topPipe.setOrigin(0, 1)
        topPipe.flipY = true
        const topPipeBody = topPipe.body as Phaser.Physics.Arcade.Body
        topPipeBody.maxVelocity.y = 0
        this.pipes.add(topPipe)

        const bottomPipe = this.physics.add.sprite(
          designWidth,
          centerY + this.pipeGap / 2,
          'pipe',
        )
        bottomPipe.setOrigin(0, 0)
        const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body
        bottomPipeBody.maxVelocity.y = 0
        this.pipes.add(bottomPipe)

        // For whatever reason this is necessary
        this.children.bringToTop(this.map)
        this.children.bringToTop(this.base)
        if (this.debugLines) {
          this.children.bringToTop(this.debugLines)
        }

        // this.physics.add.collider(player, pipe)
      }
    }
    // this.player.x += px
    // this.cameras.main.centerOnX(this.player.x + designWidth / 6)
  }
}

const sizeProps = getSizeProps({
  width: window.innerWidth,
  height: window.innerHeight,
})

export const game = new Phaser.Game({
  title: 'Flappy bird',

  type: Phaser.WEBGL,

  canvas,

  scene: [GameScene],

  width: sizeProps.viewport.width,
  height: sizeProps.viewport.height,

  scale: {
    mode: Phaser.Scale.NONE,
  },

  input: {
    keyboard: true,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug,
      gravity: { y: 1000 },
    },
  },

  render: {
    pixelArt: true,
  },

  backgroundColor: '#abcdef',
  customEnvironment: true,
})

const onResize = () => {
  const sizeProps = getSizeProps({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  if (game.scale.baseSize && game.scale.canvas) {
    game.scale.resize(sizeProps.viewport.width, sizeProps.viewport.height)
  } else {
    log('Postponing resize')
    setTimeout(onResize, 50)
    return
  }
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
  listeners.forEach(f => f(sizeProps))
}

window.addEventListener('resize', onResize)
setTimeout(onResize)
// @ts-ignore
window.game = game
setTimeout(() => {
  // console.log(game.scene.getScene('OtherScene'))
  // console.log(game.scene.isActive('OtherScene'))
  // console.log(game.scene.isActive('MainScene'))
  // game.scene.run('OtherScene')
}, 100)
