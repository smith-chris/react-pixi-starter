import Phaser from 'phaser'
import { getSizeProps, SizePropsListener } from 'setup/getSizeProps'
import { designWidth, designHeight, minHeight } from 'setup/dimensions'
import { debug } from 'utils/debug'
import { GameoverLayer } from 'layers/GameoverLayer'
import { PlayerEntity } from 'entities/PlayerEntity'
import { gameState } from './gameState'
import { PipesEntity } from 'entities/PipesEntity'

const listeners: SizePropsListener[] = []

const responsive = (listener: SizePropsListener) => {
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
  base!: Phaser.Physics.Arcade.Sprite
  debugLines?: Phaser.GameObjects.Graphics
  gameover!: GameoverLayer
  player!: PlayerEntity
  pipes!: PipesEntity

  state = { ...gameState }

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

  onBaseCollision = () => {
    this.player.setBottom(this.base.getBounds().top)
    this.onGameOver()
  }

  onGameStart = () => {
    this.gameover.hide()
    this.player.start()
  }

  onGameOver = () => {
    if (this.state.touchable) {
      this.state.touchable = false
      this.gameover.show()
      return
    }
    if (!this.state.alive) {
      return
    }
    this.state.alive = false
    this.player.stop()
  }

  onTouch = () => {
    if (!this.state.touchable) {
      return
    }
    if (!this.state.playing) {
      this.state.playing = true
      this.onGameStart()
    }
    this.player.jump()
  }

  create() {
    const bg = this.add
      .image(0, 0, 'background-day')
      .setOrigin(0, 1)
      .setDepth(0)

    this.player = new PlayerEntity({ scene: this, depth: 2 })

    this.pipes = new PipesEntity({ scene: this, player: this.player, depth: 1 })
    this.pipes.onCollision = () => {
      // Prevent calling gameover multiple times
      if (this.state.touchable) {
        this.onGameOver()
        // Player will fall down
        this.player.hit()
      }
    }

    const base = this.physics.add
      .sprite(0, 0, 'base')
      .setOrigin(0, 1)
      .setDepth(3)
    // Make it static
    base.setMaxVelocity(0)
    base.setImmovable(true)
    this.base = base
    this.physics.add.overlap(this.player.sprite, base, this.onBaseCollision)

    this.input.on('pointerdown', this.onTouch)

    this.gameover = new GameoverLayer(this).setDepth(4)
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
      const baseBottom = Math.max(450, bottom) + extraHeight
      bg.setY(baseBottom)
      base.setY(baseBottom)
      if (this.debugLines) {
        this.debugLines.y = extraHeight
      }
      const responsiveData = { top, bottom, extraHeight }
      this.gameover.responsive(responsiveData)
      this.player.responsive(responsiveData)
    })
    // setTimeout(this.onGameOver, 50)

    this.update = (timePassed: number, delta: number) => {
      const px = delta / (1000 / 60)
      const movement = Math.round(2 * px)
      const data = {
        movement,
        timePassed,
        delta,
      }
      if (this.state.touchable) {
        this.base.x = this.base.x < -11 ? 0 : this.base.x - movement
      }
      this.player.update(this.state, data)
      this.pipes.update(this.state, data)
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
