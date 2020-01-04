import Phaser from 'phaser'
import { getSizeProps, Responsive } from 'setup/getSizeProps'
import {
  designWidth,
  designHeight,
  minHeight,
  maxHeight,
} from 'setup/dimensions'
import { debug } from 'utils/debug'
import { GameoverLayer } from 'gameover/Gameover'

const listeners: Responsive[] = []

const responsive = (listener: Responsive) => {
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
  playerStartY = designHeight * 0.5
  base!: Phaser.Physics.Arcade.Sprite
  pipes: Phaser.GameObjects.Sprite[] = []
  debugLines?: Phaser.GameObjects.Graphics
  gameoverLayer!: GameoverLayer

  state = {
    playing: false,
    touchable: true,
    alive: true,
  }

  constructor() {
    super('GameScene')
  }
  preload() {
    this.load.image('background-day', 'assets/sprites/background-day.png')
    this.load.image('base', 'assets/sprites/base.png')
    this.load.image('midflap', 'assets/sprites/yellowbird-midflap.png')
    this.load.image('upflap', 'assets/sprites/yellowbird-upflap.png')
    this.load.image('downflap', 'assets/sprites/yellowbird-downflap.png')
    this.load.image('pipe', 'assets/sprites/pipe.png')
    this.load.image('gameover', 'assets/sprites/gameover.png')
    this.load.image('board', 'assets/sprites/board.png')

    for (let i = 0; i <= 9; i++) {
      this.load.image(String(i), `assets/sprites/numbers/${i}.png`)
      this.load.image(`sm${i}`, `assets/sprites/numbers/sm${i}.png`)
    }
  }

  onPipeCollision = () => {
    // Prevent calling gameover multiple times
    if (this.state.touchable) {
      this.onGameOver()
      if (this.player.body.velocity.y < 0) {
        this.player.setVelocityY(0)
      }
    }
  }

  onBaseCollision = () => {
    this.player.y =
      this.base.getBounds().top - this.map.y - this.player.height / 3
    this.onGameOver()
  }

  onGameStart = () => {
    this.gameoverLayer.hide()
    // @ts-ignore
    this.player.body.maxVelocity.y = this.player.body.maxVelocity.x
  }

  onGameOver = () => {
    if (this.state.touchable) {
      this.state.touchable = false
      this.gameoverLayer.show()
      return
    }
    if (!this.state.alive) {
      return
    }
    this.state.alive = false
    this.player.setMaxVelocity(0)
  }

  onTouch = () => {
    if (!this.state.touchable) {
      return
    }
    if (!this.state.playing) {
      this.state.playing = true
      this.onGameStart()
    }
    this.player.setVelocityY(-300)
  }

  getVariation = (timePassed: number) => Math.sin(timePassed / 7 / (1000 / 60))

  getY = (timePassed: number) =>
    this.playerStartY - Math.round(this.getVariation(timePassed) * 5)

  rotationThreshold = 0

  getRotation = (velocity: number) => {
    const rotation = Math.abs(velocity / 500)
    // Moving upwards
    if (velocity < this.rotationThreshold)
      return Math.max(-Math.PI / 3, -rotation)
    // Moving downwards
    else if (velocity >= this.rotationThreshold)
      return Math.min(Math.PI / 2, rotation)
    return 0
  }

  getTextureName = (timePassed: number) => {
    const v = this.getVariation(timePassed)
    if (v > 0.33) return 'upflap'
    if (v < -0.33) return 'downflap'
    return 'midflap'
  }
  create() {
    const bg = this.add.image(0, 0, 'background-day').setOrigin(0, 1)
    this.map = this.add.container(0, 0)

    const player = this.physics.add.sprite(
      designWidth * 0.33,
      this.playerStartY,
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

    const playerBody = player.body as Phaser.Physics.Arcade.Body
    this.player = player
    // @ts-ignore
    window.player = player
    playerBody.maxVelocity.y = 0
    this.map.add(player)

    const base = this.physics.add.sprite(0, 0, 'base').setOrigin(0, 1)
    // Make it static
    base.setMaxVelocity(0)
    base.setImmovable(true)
    this.base = base
    this.children.bringToTop(base)
    this.physics.add.overlap(player, base, this.onBaseCollision)

    this.input.on('pointerdown', this.onTouch)

    this.gameoverLayer = new GameoverLayer(this)
    // @ts-ignore
    window.scene = this

    if (debug) {
      // The design viewport
      this.debugLines = this.add
        .graphics()
        .lineStyle(2, 0xff0000, 0.75)
        .strokeRect(0, 0, designWidth, designHeight)
        .lineStyle(2, 0xfffb00, 0.75)
        .strokeRect(0, (designHeight - minHeight) / 2, designWidth, minHeight)
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
      this.gameoverLayer.responsive({ top, bottom, extraHeight })
    })
    setTimeout(this.onGameOver, 50)

    const pipeDist = 150
    const pipeGap = debug ? 120 : 120
    const angleStep = 3

    this.update = (timePassed: number, delta: number) => {
      const px = delta / (1000 / 60)
      const movement = Math.round(2 * px)
      if (this.state.touchable) {
        this.base.x = this.base.x < -11 ? 0 : this.base.x - movement

        this.pipes.forEach(pipe => {
          pipe.x -= movement
        })
      }
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
          const newRotation = this.getRotation(this.player.body.velocity.y)
          const rotationDegrees = newRotation * (180 / Math.PI)
          const rotationDegreesClapmed =
            Math.round(rotationDegrees / angleStep) * angleStep
          this.player.angle = rotationDegreesClapmed
          // this.player.rotation = this.getRotation(this.player.body.velocity.y)
        }

        const lastPipeX = this.pipes.length
          ? this.pipes[this.pipes.length - 1].x
          : -Infinity
        if (lastPipeX < designWidth - pipeDist) {
          this.pipes.forEach(p => {
            if (p.getBounds().right < 0) {
              // this.pipes.remove(p)
              p.destroy()
            }
          })
          const variation = 125
          const centerY = Math.round(
            designHeight / 2 + variation * 0.75 - Math.random() * variation,
          )

          const topPipe = this.physics.add.sprite(
            designWidth,
            centerY - pipeGap / 2,
            'pipe',
          )
          topPipe.setOrigin(0, 1)
          topPipe.flipY = true
          // topPipe.setDepth(1)
          const topPipeBody = topPipe.body as Phaser.Physics.Arcade.Body
          topPipeBody.maxVelocity.y = 0
          this.pipes.push(topPipe)
          this.physics.add.overlap(this.player, topPipe, this.onPipeCollision)

          const bottomPipe = this.physics.add.sprite(
            designWidth,
            centerY + pipeGap / 2,
            'pipe',
          )
          bottomPipe.setOrigin(0, 0)
          const bottomPipeBody = bottomPipe.body as Phaser.Physics.Arcade.Body
          bottomPipeBody.maxVelocity.y = 0
          this.pipes.push(bottomPipe)
          this.physics.add.overlap(
            this.player,
            bottomPipe,
            this.onPipeCollision,
          )

          // For whatever reason this is necessary
          this.children.bringToTop(this.map)
          this.children.bringToTop(this.base)
          if (this.debugLines) {
            this.children.bringToTop(this.debugLines)
          }
        }
      }
    }
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
