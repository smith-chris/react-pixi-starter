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

type A = Phaser.Physics.Arcade.Body['maxVelocity']

const canvas = document.getElementById('canvas') as HTMLCanvasElement

class GameScene extends Phaser.Scene {
  map!: Phaser.GameObjects.Container
  player!: Phaser.Physics.Arcade.Sprite
  base!: Phaser.Physics.Arcade.Sprite
  pipes!: Phaser.Physics.Arcade.Group
  state = {
    playing: true,
  }

  constructor() {
    super('GameScene')
  }
  preload() {
    this.load.image('background-day', 'assets/sprites/background-day.png')
    this.load.image('base', 'assets/sprites/base.png')
    this.load.image('bird', 'assets/sprites/yellowbird-midflap.png')
    this.load.image('pipe', 'assets/sprites/pipe-green.png')
  }
  create() {
    const bg = this.add.image(0, 0, 'background-day').setOrigin(0, 1)
    this.map = this.add.container(0, 0)

    const player = this.physics.add.sprite(
      designWidth / 3,
      designHeight / 2,
      'bird',
    )
    player.body.setMass(Number.MAX_SAFE_INTEGER)

    const playerBody = player.body as Phaser.Physics.Arcade.Body
    this.player = player
    // @ts-ignore
    window.player = player
    playerBody.maxVelocity.y = 0
    playerBody.world
    this.map.add(player)

    this.pipes = this.physics.add.group({
      velocityX: -100,
    })

    const base = this.physics.add.sprite(0, 0, 'base').setOrigin(0, 1)
    // Make it static
    base.setMaxVelocity(0)
    base.setImmovable(true)
    this.base = base
    this.children.bringToTop(base)
    // this.physics.add.collider(player, base)

    responsive(({ stage }) => {
      const extraHeight = stage.position.y / stage.scale.y
      const bottom = designHeight + extraHeight
      const top = -extraHeight
      this.map.y = extraHeight
      const baseBottom = Math.max(450, bottom) + extraHeight
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
      this.map.add(debugLines)
    }
  }

  pipeDist = 150

  update(_, delta: number) {
    // const px = delta / (1000 / 60)
    if (this.state.playing) {
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
        const pipe = this.physics.add.sprite(designWidth, 300, 'pipe')
        pipe.setOrigin(0, 0)
        const pipeBody = pipe.body as Phaser.Physics.Arcade.Body
        pipeBody.maxVelocity.y = 0
        this.pipes.add(pipe)
        // For whatever reason this is necessary
        this.children.bringToTop(this.base)

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
