import Phaser from 'phaser'
import { getSizeProps, SizePropsListener } from 'setup/getSizeProps'
import { designWidth, designHeight, minHeight } from 'setup/dimensions'
import { debug } from 'utils/debug'
import { GameoverLayer } from 'layers/GameoverLayer'
import { PlayerEntity } from 'entities/PlayerEntity'
import { gameState } from './gameState'
import { PipesEntity } from 'entities/PipesEntity'
import { NumberComponent } from 'entities/NumberComponent'
import { responsive } from 'onResize'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }
  preload() {
    ;[
      ['background-day', 'background-day'],
      ['base', 'base'],
      ['midflap', 'yellowbird-midflap'],
      ['upflap', 'yellowbird-upflap'],
      ['downflap', 'yellowbird-downflap'],
      ['pipe', 'pipe'],
      ['gameover', 'gameover'],
      ['board', 'board'],
      ['getready'],
      ['new'],
      ['tap'],
    ].forEach(([name, file]) => {
      this.load.image(name, `assets/sprites/${file || name}.png`)
    })
    ;['ok', 'share', 'start', 'score'].forEach(btn => {
      this.load.image(btn, `assets/sprites/buttons/${btn}.png`)
    })
    ;['hit', 'die', 'wing', 'point', 'swoosh'].forEach(sound => {
      this.load.audio(sound, [
        `assets/audio/${sound}.ogg`,
        `assets/audio/${sound}.wav`,
      ])
    })

    for (let i = 0; i <= 9; i++) {
      this.load.image(String(i), `assets/sprites/numbers/${i}.png`)
      this.load.image(`sm${i}`, `assets/sprites/numbers/sm${i}.png`)
    }
  }

  create() {
    let state = { ...gameState }

    const onBaseCollision = () => {
      if (!state.canCollide) {
        // F.. phaser triggers collisions after player has been moved outside
        // even 1500ms after..
        return
      }
      player.setBottom(base.getBounds().top)
      onGameOver()
      // So dogy, and so mutation-based gamedev..
      if (gameover.visible) {
        return
      }
      this.sound.play('hit')
    }

    const onGameReset = (playSound = true) => {
      // console.log('game reset')
      state = { ...gameState }
      gameover.hide()
      if (playSound) {
        this.sound.play('swoosh')
      }
      pipes.reset()
      player.reset()
      currentScore.setText(state.score)
      currentScore.show()
      showNewgame()
    }

    const onGameStart = () => {
      hideNewgame()
      player.start()
    }

    const onGameOver = () => {
      if (state.touchable) {
        // console.log('stop touchable')
        state.touchable = false
        currentScore.hide()
        gameover.show()
        gameover.score.setText(state.score)
        let best = Number(localStorage.getItem('fb_best'))
        if (best < state.score) {
          // Setting a new high score!
          gameover.newLabel.setAlpha(1)
          best = state.score
          localStorage.setItem('fb_best', best.toString())
        }
        gameover.best.setText(best)
        return
      }
      if (!state.alive) {
        return
      }
      // console.log('stop player')
      state.alive = false
      player.stop()
    }

    const onTouch = () => {
      if (gameover.visible) {
        return
      }
      if (!state.touchable) {
        return
      }
      if (!state.playing) {
        // console.log('touch start')
        player.start()
        state.playing = true
        onGameStart()
      }
      player.jump()
      this.sound.play('wing')
      if (!state.canCollide) {
        state.canCollide = true
      }
    }

    const bg = this.add
      .image(0, 0, 'background-day')
      .setOrigin(0, 1)
      .setDepth(0)
    // this.input.on('pointerdown', onTouch)
    bg.setInteractive()
    this.input.on('pointerdown', onTouch)

    const player = new PlayerEntity({ scene: this, depth: 2 })

    const pipes = new PipesEntity({ scene: this, player: player, depth: 1 })
    pipes.onCollision = () => {
      if (!state.canCollide) {
        return
      }
      // if (state.alive) {
      //   console.log('pipes onCollision')
      // }
      // Prevent calling gameover multiple times
      if (state.touchable) {
        onGameOver()
        // Player will fall down
        player.hit()
        this.sound.play('hit')
        setTimeout(() => {
          this.sound.play('die')
        }, 100)
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

    const currentScore = new NumberComponent({ scene: this, depth: depth++ })
    currentScore.x = designWidth / 2
    currentScore.setText(state.score)

    const gameover = new GameoverLayer(this).setDepth(depth++)

    const newgame = this.add
      .container(designWidth / 2, 120)
      .setDepth(depth++)
      .setAlpha(0)
    const getready = this.add.sprite(0, 0, 'getready')
    const tap = this.add.sprite(0, 100, 'tap')
    newgame.add(getready)
    newgame.add(tap)
    const showNewgame = () => {
      this.tweens.add({
        targets: newgame,
        alpha: { from: 0, to: 1 },
        ease: 'Quad',
        duration: 250,
      })
    }

    const hideNewgame = () => {
      this.tweens.add({
        targets: newgame,
        alpha: { from: 1, to: 0 },
        ease: 'Quad',
        duration: 250,
      })
    }

    gameover.ok.on('pointerdown', onGameReset)
    gameover.share.on('pointerdown', onGameReset)

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
        .setDepth(99)
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
      const safeTop = Math.max(0, extraHeight)
      const responsiveData = {
        top,
        safeTop,
        bottom,
        extraHeight,
        viewportHeight: extraHeight * 2 + designHeight,
        base: base.getBounds(),
      }
      gameover.responsive(responsiveData)
      player.responsive(responsiveData)
      pipes.responsive(responsiveData)
      currentScore.y = (top + safeTop) / 2 + 14
    })

    // setTimeout(onGameOver, 50)
    onGameReset(false)

    pipes.onScore = () => {
      currentScore.setText(++state.score)
      this.sound.play('point')
    }

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
      // console.log('update', state.alive)
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

// @ts-ignore
window.game = game
