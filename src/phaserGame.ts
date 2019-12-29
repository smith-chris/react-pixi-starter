import Phaser from 'phaser'
import { designHeight, designWidth, minRatio, maxRatio } from 'setup/dimensions'

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

export const game = new Phaser.Game({
  title: 'Sample',

  type: Phaser.WEBGL,

  canvas,

  scene: MainScene,

  width: designWidth,
  height: designHeight,

  // scale: {
  //   mode: Phaser.Scale.ENVELOP,
  //   // autoCenter: Phaser.Scale.NO_CENTER,
  //   width: designWidth,
  //   height: designHeight,
  //   min: {
  //     width: designWidth,
  //     height: designWidth * (1 / minRatio),
  //   },
  //   max: {
  //     width: designWidth,
  //     height: designWidth * (1 / maxRatio),
  //   },
  // },

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

  backgroundColor: '#abcdef',
  customEnvironment: true,
})

setTimeout(() => {
  console.log(game.renderer.width, game.renderer.height)
})
