import { GameObjects, Scene } from 'phaser'
import { designWidth, designHeight, maxHeight } from 'setup/dimensions'
export type Flatten<T extends any> = T[number]

export class GameoverLayer extends GameObjects.Container {
  show: Function
  hide: Function

  constructor(scene: Scene) {
    super(scene)
    scene.add.existing(this)
    this.y = 15

    const methods = ['sprite'] as const
    type Methods = Flatten<typeof methods>
    const add = methods.reduce((acc, curr: string) => {
      acc[curr] = (...params) => {
        const object = scene.add[curr](...params)
        this.add(object)
        return object
      }
      return acc
    }, {} as Pick<Scene['add'], Methods>)

    const titleY = 68
    const title = add.sprite(designWidth / 2, titleY, 'gameover').setAlpha(0)

    const boardBottom = designHeight - 135
    const board = add
      .sprite(designWidth / 2, 0, 'board')
      .setOrigin(0.5, 1)
      .setAlpha(0)

    this.show = () => {
      scene.children.bringToTop(this)
      const time = 100

      // Object.values(this.ui).forEach(e => {
      //   console.log(e)
      //   e?.setDepth(2)
      // })

      scene.tweens.add({
        targets: title,
        y: titleY - 2,
        ease: 'Linear',
        duration: time,
        onComplete: () => {
          scene.tweens.add({
            targets: title,
            y: titleY + 2,
            ease: 'Linear',
            duration: time,
            onComplete: () => {
              board.y = maxHeight + board.height
              board.setAlpha(1)
              scene.tweens.add({
                targets: board,
                y: boardBottom,
                ease: 'Quad',
                duration: 333, //166
              })
            },
          })
        },
      })
      scene.tweens.add({
        targets: title,
        alpha: 1,
        ease: 'Bounce',
        duration: time,
      })
    }

    this.hide = () => {
      console.log('hide me!')
    }
  }
}
