import { BaseTexture, Texture, Rectangle } from 'pixi.js'
import { Point } from 'utils/math'
import ghostIdle from 'assets/ghost-idle.png'

export type ObjectOf<T> = {
  [key: string]: T
}

export const each = <T, R>(
  input: ObjectOf<T> | ObjectOf<T>[],
  f: (v: T, k: string, index: number) => R,
) => {
  const results: R[] = []
  const iterate = (object: ObjectOf<T>, index: number) => {
    for (const key in object) {
      const val = object[key]
      results.push(f(val, key, index))
    }
  }
  if (Array.isArray(input)) {
    input.forEach((object, index) => {
      iterate(object, index)
    })
  } else {
    iterate(input, 0)
  }
  return results
}

const defaultOptions = {
  loop: true,
  delay: 0,
  endReversed: false,
}

const optional = <T extends object>(o: T) => o as { [K in keyof T]?: T[K] }

export const createAnimation = (
  { src, width, height }: ImageAsset,
  { count = 0, gap = 6 },
  offset?: Point,
  options = optional(defaultOptions),
) => {
  const singleFrameWidth = width / count
  const texture = BaseTexture.from(src)
  let _lastFrameTexture: Texture
  const result = {
    texture,
    framesCount: count,
    width: singleFrameWidth,
    totalWidth: width,
    height,
    frameGap: gap,
    name: '??',
    offset,
    options: { ...defaultOptions, ...options },
    getLastFrameTexture: () => {
      if (!_lastFrameTexture) {
        _lastFrameTexture = new Texture(texture)
        _lastFrameTexture.frame = new Rectangle(0, 0, width, height)
      }
      return _lastFrameTexture
    },
  }
  return result
}

export type Animation = ReturnType<typeof createAnimation>

const ghostOffset = new Point(0, 0)
export const ghostAnimation = {
  idle: createAnimation(ghostIdle, { count: 6, gap: 6 }, ghostOffset),
}

each(ghostAnimation, (animation, key) => {
  animation.name = `Ghost.${key}`
})
