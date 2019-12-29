import Phaser from 'phaser'
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
  title: 'Flappy bird',

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

  if (game.scale.baseSize && game.scale.canvas) {
    game.scale.resize(sizeProps.viewport.width, sizeProps.viewport.height)
  } else {
    log('Postponing resize')
    setTimeout(onResize, 50)
    return
  }
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
}

window.addEventListener('resize', onResize)
setTimeout(onResize)
// @ts-ignore
window.game = game
setTimeout(() => {
  // console.log(game.scene.getScene('OtherScene'))
  // console.log(game.scene.isActive('OtherScene'))
  // console.log(game.scene.isActive('MainScene'))
  game.scene.run('OtherScene')
}, 100)
