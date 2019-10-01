export class Point {
  static ZERO = new Point(0, 0)

  static clone(p: Point) {
    return new Point(p.x, p.y)
  }

  static assign(pA: Point, pB: Point) {
    pA.x = pB.x
    pA.y = pB.y
    return pA
  }

  static equals(pA: Point, pB?: Point) {
    if (!pB) {
      console.warn('Point.equals pointB not defined, returning false...')
      return false
    }
    return pA.x === pB.x && pA.y === pB.y
  }

  static set(p: Point, x: number, y?: number) {
    p.x = x
    p.y = y || x
    return p
  }

  static round(p: Point) {
    p.x = Math.round(p.x)
    p.y = Math.round(p.y)
    return p
  }

  static substract(pA: Point, pB: Point) {
    pA.x -= pB.x
    pA.y -= pB.y
    return pA
  }

  static merge(pA: Point, pB: Point) {
    pA.x += pB.x
    pA.y += pB.y
    return pA
  }

  static multiply(p: Point, scalar: number) {
    p.x *= scalar
    p.y *= scalar
    return p
  }

  static distance(pA: Point, pB: Point) {
    return Math.sqrt(
      (pA.x - pB.x) * (pA.x - pB.x) + (pA.y - pB.y) * (pA.y - pB.y),
    )
  }

  static magnitude(p: Point) {
    return Math.sqrt(p.x * p.x + p.y * p.y)
  }

  static divide(p: Point, scalar: number) {
    p.x /= scalar
    p.y /= scalar
    return p
  }

  static normalise(p: Point) {
    return Point.divide(p, Point.magnitude(p))
  }

  static angle(pA: Point, pB: Point) {
    const dy = pA.y - pB.y
    const dx = pA.x - pB.x
    let theta = Math.atan2(dy, dx) // range (-PI, PI]
    theta *= 180 / Math.PI // rads to degs, range (-180, 180]
    if (theta < 0) theta = 360 + theta // range [0, 360)
    return theta
  }

  constructor(public x: number, public y = x) {}
}
