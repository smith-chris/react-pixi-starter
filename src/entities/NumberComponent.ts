import Phaser, { Scene } from 'phaser'
import { designWidth, designHeight } from 'setup/dimensions'
import { Update, Responsive } from 'gameState'

export class NumberComponent {
  responsive: Responsive
  setText: (value: number) => void

  constructor({
    scene,
    depth = 0,
    sm = false,
  }: {
    scene: Scene
    depth?: number
    sm?: boolean
  }) {
    const container = scene.add.container(designWidth / 2, 0)
    const sprites: Phaser.GameObjects.Sprite[] = []
    const getSprite = (v: string, sm = false) => {
      const res = sprites.find(s => s.alpha === 0)
      if (res) {
        res.setAlpha(1)
        res.setTexture(v)
        return res
      }
      const sprite = scene.add.sprite(0, 0, v).setOrigin(0, 0)
      container.add(sprite)
      sprites.push(sprite)
      return sprite
    }

    const txWidth = getSprite('0', sm).width

    this.responsive = ({ top, safeTop }) => {
      container.y = (top + safeTop) / 2 + 14
    }

    this.setText = value => {
      const str = value.toString()
      const length = str.length
      const step = txWidth + 2
      let left = -Math.round((length * step) / 2)
      sprites.forEach(s => s.setAlpha(0))
      for (let i = 0; i < length; i++) {
        const sprite = getSprite(str[i])
        sprite.x = left
        left += step
      }
    }
  }
}
