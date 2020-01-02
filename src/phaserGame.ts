import Phaser from 'phaser'
import { getSizeProps } from 'setup/getSizeProps'
import {
  designWidth,
  designHeight,
  minHeight,
  maxHeight,
} from 'setup/dimensions'
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
  uiContainer!: Phaser.GameObjects.Container
  ui: Partial<Record<'gameover' | 'board', Phaser.GameObjects.Image>> = {}
  gameoverY = 68
  boardDist = 25
  boardBottom = designHeight - 135
  front: Phaser.GameObjects.GameObject[] = []
  player!: Phaser.Physics.Arcade.Sprite
  base!: Phaser.Physics.Arcade.Sprite
  pipes!: Phaser.Physics.Arcade.Group
  whiteRect!: Phaser.GameObjects.Rectangle
  debugLines?: Phaser.GameObjects.Graphics

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
    }
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

    this.whiteRect = this.add
      .rectangle(0, 0, designWidth, maxHeight, 0xffffff)
      .setOrigin(0)
      .setAlpha(0)
    this.front.push(this.whiteRect)

    this.ui.gameover = this.add
      .image(designWidth / 2, this.gameoverY, 'gameover')
      .setAlpha(0)

    this.ui.board = this.add
      .image(designWidth / 2, 0, 'board')
      .setOrigin(0.5, 1)
      .setAlpha(0)

    const uiContainer = this.add.container(0, 0)
    this.uiContainer = uiContainer
    Object.values(this.ui).forEach(e => e && uiContainer.add(e))

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
      uiContainer.y = extraHeight
      const baseBottom = Math.max(450, bottom) + extraHeight
      bg.setY(baseBottom)
      base.setY(baseBottom)
      if (this.debugLines) {
        this.debugLines.y = extraHeight
      }
    })
    // setTimeout(this.onGameOver, 50)
  }

  onPipeCollision = () => {
    // Prevent calling gameover multiple times
    if (this.state.touchable) {
      this.onGameOver()
    }
  }

  onBaseCollision = () => {
    this.onGameOver()
  }

  onGameStart = () => {
    Object.values(this.ui).forEach(e => e?.setAlpha(0))
    // @ts-ignore
    this.player.body.maxVelocity.y = this.player.body.maxVelocity.x
  }

  onGameOver = () => {
    if (this.state.touchable) {
      this.state.touchable = false
      this.pipes.setVelocityX(0)
      this.whiteRect.setAlpha(1)
      this.tweens.add({
        targets: this.whiteRect,
        alpha: { from: 1, to: 0 },
        ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 250,
        repeat: 0, // -1: infinity
        yoyo: false,
        onComplete: () => {
          this.showBoard()
        },
      })
      return
    }
    if (!this.state.alive) {
      return
    }
    this.state.alive = false
    this.player.setMaxVelocity(0)
  }

  showBoard = () => {
    const time = 100
    this.children.bringToTop(this.uiContainer)

    this.tweens.add({
      targets: this.ui.gameover,
      y: this.gameoverY - 2,
      ease: 'Linear',
      duration: time,
      onComplete: () => {
        this.tweens.add({
          targets: this.ui.gameover,
          y: this.gameoverY + 2,
          ease: 'Linear',
          duration: time,
          onComplete: () => {
            if (this.ui.board) {
              this.ui.board.y = maxHeight + (this.ui.board?.height || 0)
              this.ui.board.setAlpha(1)
              this.tweens.add({
                targets: this.ui.board,
                y: this.boardBottom,
                ease: 'Quad',
                duration: 333, //166
              })
            }
          },
        })
      },
    })
    this.tweens.add({
      targets: this.ui.gameover,
      alpha: 1,
      ease: 'Bounce',
      duration: time,
    })
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
    designHeight / 2 -
    this.player.height / 2 +
    Math.round(this.getVariation(timePassed) * 5)

  rotationThreshold = 0

  getRotation = (velocity: number) => {
    const rotation = Math.abs(velocity / 500)
    // Moving upwards
    if (velocity < this.rotationThreshold) return Math.max(-0.5, -rotation)
    // Moving downwards
    else if (velocity > this.rotationThreshold) return Math.min(1.5, rotation)
    return 0
  }

  getTextureName = (timePassed: number) => {
    const v = this.getVariation(timePassed)
    if (v > 0.33) return 'upflap'
    if (v < -0.33) return 'downflap'
    return 'midflap'
  }
  pipeDist = 150
  pipeGap = debug ? 120 : 120
  angleStep = 3

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
        const newRotation = this.getRotation(this.player.body.velocity.y)
        const rotationDegrees = newRotation * (180 / Math.PI)
        const rotationDegreesClapmed =
          Math.round(rotationDegrees / this.angleStep) * this.angleStep
        this.player.angle = rotationDegreesClapmed
        // this.player.rotation = this.getRotation(this.player.body.velocity.y)
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
        this.front.forEach(go => this.children.bringToTop(go))
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
