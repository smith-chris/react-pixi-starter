import { GameObjects, Scene } from 'phaser'
import { designWidth, designHeight, maxHeight } from 'setup/dimensions'
import { Responsive } from 'gameState'
import { NumberComponent } from 'entities/NumberComponent'
export type Flatten<T extends any> = T[number]

export class GameoverLayer extends GameObjects.Container {
  show: Function
  hide: Function
  responsive: Responsive
  score: NumberComponent
  best: NumberComponent

  constructor(scene: Scene) {
    super(scene)
    scene.add.existing(this)

    const methods = ['sprite', 'rectangle', 'container'] as const
    type Methods = Flatten<typeof methods>
    const add = methods.reduce((acc, curr: string) => {
      acc[curr] = (...params) => {
        const object = scene.add[curr](...params)
        this.add(object)
        return object
      }
      return acc
    }, {} as Pick<Scene['add'], Methods>)

    const ui = add.container(0, 0)

    const titleY = 68
    const title = add.sprite(designWidth / 2, titleY, 'gameover').setAlpha(0)
    ui.add(title)

    const boardBottom = designHeight - 135
    const board = scene.add.container(designWidth / 2, 0).setAlpha(0)
    ui.add(board)
    const boardBg = add.sprite(0, 0, 'board').setOrigin(0.5, 1)
    board.add(boardBg)
    const score = new NumberComponent({ scene, align: 'right' })
    const best = new NumberComponent({ scene, align: 'right' })
    board.add(score)
    board.add(best)
    const boardTop = boardBg.getBounds().top
    const boardRight = boardBg.width / 2
    const scoreLabelBottom = 30
    const bestLabelBottom = 72
    const labelsDist = 30
    score.x = best.x = boardRight - 22
    score.y =
      Math.round(
        boardTop + scoreLabelBottom + labelsDist / 2 - score.height / 2,
      ) - 1
    best.y =
      Math.round(
        boardTop + bestLabelBottom + labelsDist / 2 - best.height / 2,
      ) - 1
    score.setText(0)
    best.setText(0)
    this.score = score
    this.best = best

    const whiteRect = add
      .rectangle(0, 0, designWidth, maxHeight, 0xffffff)
      .setOrigin(0)
      .setAlpha(0)

    this.responsive = ({ extraHeight }) => {
      ui.y = extraHeight
    }

    this.show = () => {
      this.setAlpha(1)
      whiteRect.setAlpha(1)
      scene.tweens.add({
        targets: whiteRect,
        alpha: { from: 1, to: 0 },
        ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 250,
        repeat: 0, // -1: infinity
        yoyo: false,
        onComplete: showUI,
      })
    }
    const showUI = () => {
      const time = 100

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
      this.setAlpha(0)
    }
  }
}
