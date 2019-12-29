import Phaser from 'phaser'

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

  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  backgroundColor: '#abcdef',
  customEnvironment: true,
})
