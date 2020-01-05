import Phaser, { Scene } from 'phaser'
import { designWidth, maxHeight } from 'setup/dimensions'

export class NumberComponent extends Phaser.GameObjects.Container {
  setText: (value: number) => void
  hide: Function
  show: Function
  // height: number

  constructor({
    scene,
    depth = 0,
    sm = false,
    align = 'middle',
  }: {
    scene: Scene
    depth?: number
    sm?: boolean
    align?: 'right' | 'middle' | 'left'
  }) {
    super(scene, 0, 0)
    scene.add.existing(this)
    const container = this
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

    const testSprite = getSprite('0', sm)
    const txWidth = testSprite.width
    this.height = testSprite.height

    // scene.add.rectangle(designWidth / 2 - 1, 0, 2, maxHeight, 0xfff)

    this.hide = () => {
      container.setAlpha(0)
    }

    this.show = () => {
      container.setAlpha(1)
    }

    this.setText = value => {
      const str = value.toString()
      const length = str.length
      const spacing = sm ? 1 : 2
      const step = txWidth + spacing
      const width = length * step - spacing
      // align=left
      let left = 0
      switch (align) {
        case 'middle':
          left = -Math.round((length * step) / 2)
          break
        case 'right':
          left = -Math.round(width)
          break
      }
      // case
      sprites.forEach(s => s.setAlpha(0))
      for (let i = 0; i < length; i++) {
        const sprite = getSprite(str[i])
        sprite.x = left
        left += step
      }
    }
  }
}
