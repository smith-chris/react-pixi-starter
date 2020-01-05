import Phaser from 'phaser'
import { getSizeProps, SizePropsListener } from 'setup/getSizeProps'
import { designWidth, designHeight, minHeight } from 'setup/dimensions'
import { debug } from 'utils/debug'
import { GameoverLayer } from 'layers/GameoverLayer'
import { PlayerEntity } from 'entities/PlayerEntity'
import { gameState } from './gameState'
import { PipesEntity } from 'entities/PipesEntity'
import { NumberComponent } from 'entities/NumberComponent'

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

  create() {
    const state = { ...gameState }

    const onBaseCollision = () => {
      player.setBottom(base.getBounds().top)
      onGameOver()
    }

    const onGameStart = () => {
      gameover.hide()
      scoreComponent.show()
      player.start()
    }

    const onGameOver = () => {
      if (state.touchable) {
        state.touchable = false
        scoreComponent.hide()
        gameover.show()
        return
      }
      if (!state.alive) {
        return
      }
      state.alive = false
      player.stop()
    }

    const onTouch = () => {
      if (!state.touchable) {
        return
      }
      if (!state.playing) {
        state.playing = true
        onGameStart()
      }
      player.jump()
    }

    this.input.on('pointerdown', onTouch)

    const bg = this.add
      .image(0, 0, 'background-day')
      .setOrigin(0, 1)
      .setDepth(0)

    const player = new PlayerEntity({ scene: this, depth: 2 })

    const pipes = new PipesEntity({ scene: this, player: player, depth: 1 })
    pipes.onCollision = () => {
      // Prevent calling gameover multiple times
      if (state.touchable) {
        onGameOver()
        // Player will fall down
        player.hit()
      }
    }

    let depth = 3

    const base = this.physics.add
      .sprite(0, 0, 'base')
      .setOrigin(0, 1)
      .setDepth(depth++)
    // Make it static
    base.setMaxVelocity(0)
    base.setImmovable(true)
    this.physics.add.overlap(player.sprite, base, onBaseCollision)

    const scoreComponent = new NumberComponent({ scene: this, depth: depth++ })
    scoreComponent.setText(0)

    const gameover = new GameoverLayer(this).setDepth(depth++)

    // @ts-ignore
    window.scene = this
    let debugLines: Phaser.GameObjects.Graphics | undefined

    if (debug) {
      // The design viewport
      debugLines = this.add
        .graphics()
        .lineStyle(2, 0xff0000, 0.75)
        .strokeRect(0, 0, designWidth, designHeight)
        .lineStyle(2, 0xfffb00, 0.75)
        .strokeRect(0, (designHeight - minHeight) / 2, designWidth, minHeight)
    }

    responsive(({ stage }) => {
      const extraHeight = stage.position.y / stage.scale.y
      const bottom = designHeight + extraHeight
      const top = 0
      const baseBottom = Math.max(450, bottom) + extraHeight
      bg.setY(baseBottom)
      base.setY(baseBottom)
      if (debugLines) {
        debugLines.y = extraHeight
      }
      const responsiveData = {
        top,
        safeTop: Math.max(0, extraHeight),
        bottom,
        extraHeight,
        viewportHeight: extraHeight * 2 + designHeight,
        base: base.getBounds(),
      }
      gameover.responsive(responsiveData)
      player.responsive(responsiveData)
      pipes.responsive(responsiveData)
      scoreComponent.responsive(responsiveData)
    })
    // setTimeout(this.onGameOver, 50)

    pipes.onScore = () => scoreComponent.setText(++state.score)

    this.update = (timePassed: number, delta: number) => {
      const px = delta / (1000 / 60)
      const movement = Math.round(2 * px)
      const data = {
        movement,
        timePassed,
        delta,
      }
      if (state.touchable) {
        base.x = base.x < -11 ? 0 : base.x - movement
      }
      player.update(state, data)
      pipes.update(state, data)
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
