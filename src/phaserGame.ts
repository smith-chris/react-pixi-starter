import Phaser from 'phaser'
import { designHeight, designWidth, minRatio, maxRatio } from 'setup/dimensions'
import { getSizeProps } from 'setup/getSizeProps'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

class MainScene extends Phaser.Scene {
  constructor() {
    super('PlayGame')
  }
  preload() {
    // this.load.image(
    //   'logo',
    //   ,
    // )
  }
  create() {
    const logo = this.add.text(100, 150, 'Hello', { fontSize: 30 })

    logo.setInteractive().on('pointerdown', () => {
      console.log('PD!!')
    })

    this.tweens.add({
      targets: logo,
      y: 450,
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

  scene: MainScene,

  width: sizeProps.viewport.width,
  height: sizeProps.viewport.height,

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

  game.renderer?.resize(sizeProps.viewport.width, sizeProps.viewport.height)
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
  console.log(sizeProps.stage)
  console.log(sizeProps.canvas)
  console.log(sizeProps.renderer)
  console.log(sizeProps.viewport)
  // console.log(game.renderer.width, game.renderer.height)
}

window.addEventListener('resize', onResize)
onResize()
// @ts-ignore
window.game = game
// setTimeout(onResize, 10)

game.events.on('load', () => {
  console.log('load')
})
