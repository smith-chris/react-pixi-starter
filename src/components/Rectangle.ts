import { PixiComponent } from '@inlet/react-pixi'
import { Graphics, Point } from 'pixi.js'

export type Rect = {
  x?: number
  y?: number
  width: number
  height: number
  anchor?: number | Point
}

export const rectsEqual = (rA: Rect, rB: Rect) =>
  rA.x === rB.x &&
  rA.y === rB.y &&
  rA.width === rB.width &&
  rA.height === rB.height &&
  rA.anchor === rB.anchor

type RectangleProps = {
  position?: Point
  anchor?: number | Point
  color?: number
  width: number
  height: number
  x?: number
  y?: number
  alpha?: number
}

const applyProps = (graphics: Graphics, { position }: RectangleProps) => {
  if (position) {
    graphics.position = position
  }
}

export const Rectangle = PixiComponent<RectangleProps, Graphics>('Rect', {
  create(props) {
    const g = new Graphics()
    applyProps(g, props)
    return g
  },
  applyProps(instance, prev, next) {
    applyProps(instance, next)
    if (
      !rectsEqual(prev, next) ||
      prev.color !== next.color ||
      prev.alpha !== next.alpha
    ) {
      const { color, alpha, anchor = 0, x, y, width, height } = next
      instance.clear()
      instance.beginFill(color || 0xffffff, alpha)
      instance.drawRect(
        (x || 0) - width * (typeof anchor === 'number' ? anchor : anchor.x),
        (y || 0) - height * (typeof anchor === 'number' ? anchor : anchor.y),
        width,
        height,
      )
      instance.endFill()
    }
  },
})
