import Phaser from 'phaser'
import { designHeight, designWidth, minRatio, maxRatio } from 'setup/dimensions'
import { getSizeProps } from 'setup/getSizeProps'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }
  create() {
    const stage = this.add.container(0, 0)
    const logo = stage.add(this.add.text(100, 150, 'Hello', { fontSize: 30 }))

    logo.setInteractive().on('pointerdown', () => {
      console.log('PD!!')
    })

    this.tweens.add({
      targets: logo,
      y: 250,
      duration: 200000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    })
  }
}

class OtherScene extends Phaser.Scene {
  constructor() {
    super('OtherScene')
  }
  create() {
    const stage = this.add.container(0, 0)
    const logo = stage.add(this.add.text(100, 250, 'Hello', { fontSize: 30 }))

    logo.setInteractive().on('pointerdown', () => {
      console.log('PD!!')
    })

    this.tweens.add({
      targets: logo,
      y: 150,
      duration: 200000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    })
  }
}

const sizeProps = getSizeProps({
  width: window.innerWidth,
  height: window.innerHeight,
})

export const game = new Phaser.Game({
  title: 'Sample',

  type: Phaser.WEBGL,

  canvas,

  scene: [MainScene, OtherScene],

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
      debug: true,
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

  // Object.assign(stage, sizeProps.stage)

  // game.renderer?.resize(sizeProps.viewport.width, sizeProps.viewport.height)
  // game.width
  if (game.scale.baseSize && game.scale.canvas) {
    game.scale.resize(sizeProps.viewport.width, sizeProps.viewport.height)
  }
  // canvas.width = sizeProps.canvas.width
  // canvas.height = sizeProps.canvas.height
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
  // game.scale.
  // game.scale.width = sizeProps.viewport.width
  // game.scale.height = sizeProps.viewport.height
  // const currentScene = game.scene.scenes[0]
  // if (currentScene) {
  //   log('Setting scene')
  //   currentScene.scale = sizeProps.stage.scale
  //   currentScene.position = sizeProps.stage.position
  // } else {
  //   log('No scene', game.scene.scenes)
  // }
  // console.log(sizeProps.stage)
  // console.log(sizeProps.canvas)
  // console.log(sizeProps.renderer)
  // console.log(sizeProps.viewport)
  // console.log(game.renderer.width, game.renderer.height)
}

window.addEventListener('resize', onResize)
onResize()
// @ts-ignore
window.game = game
// window.Phaser = Phaser
// setTimeout(onResize, 10)

game.events.on('load', () => {
  console.log('load')
})
