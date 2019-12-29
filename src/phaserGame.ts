import Phaser from 'phaser'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const game = new Phaser.Game({
  title: 'Sample',

  type: Phaser.WEBGL,

  canvas,

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
