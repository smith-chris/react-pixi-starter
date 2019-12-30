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
  bird = {
    x: designWidth / 3,
    y: designHeight / 2,
  }

  surface!: Phaser.GameObjects.Container

  constructor() {
    super('GameScene')
  }
  preload() {
    this.load.image('background-day', 'assets/sprites/background-day.png')
    this.load.image('base', 'assets/sprites/base.png')
    this.load.image('bird', 'assets/sprites/yellowbird-midflap.png')
  }
  create() {
    this.surface = this.add.container(0, 0)
    const bg = this.add.image(0, 0, 'background-day').setOrigin(0, 1)
    this.surface.add(bg)

    const player = this.physics.add.sprite(this.bird.x, this.bird.y, 'bird')
    this.surface.add(player)
    const base = this.add.image(0, 0, 'base').setOrigin(0, 1)
    this.surface.add(base)

    setTimeout(() => {
      player.disableBody()
    }, 20)

    responsive(({ stage, viewport }) => {
      const extraHeight = stage.position.y / stage.scale.y
      const bottom = designHeight + extraHeight
      const top = -extraHeight
      this.surface.y = extraHeight
      const baseBottom = Math.max(450, bottom)
      bg.setY(baseBottom)
      base.setY(baseBottom)
    })

    if (debug) {
      // The design viewport
      const debugLines = this.add
        .graphics()
        .lineStyle(2, 0xffff00, 0.5)
        .strokeRect(0, 0, designWidth, designHeight)
        .lineStyle(2, 0xff00ff, 0.5)
        .strokeRect(0, (designHeight - minHeight) / 2, designWidth, minHeight)
      this.surface.add(debugLines)
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
      gravity: { y: 300 },
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
