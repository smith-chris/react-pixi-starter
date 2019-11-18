export class Point {
  constructor(public x: number, public y = x) {}

  static ZERO = new Point(0, 0)

  static isPoint(v: any): v is Point {
    return v && typeof v.x === 'number' && typeof v.y === 'number'
  }

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

  static(pA: Point, pB: Point) {
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
}

export class Rect {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
  ) {}

  static isRect(v: any): v is Rect {
    return (
      v &&
      typeof v.width === 'number' &&
      typeof v.height === 'number' &&
      Point.isPoint(v)
    )
  }

  static isEmpty(r: Rect) {
    return r.width <= 0 || r.height <= 0
  }

  static right(r: Rect) {
    return r.x + r.width
  }

  static bottom(r: Rect) {
    return r.y + r.height
  }
}

export class Circle {
  constructor(public x = 0, public y = 0, public radius = 0) {}

  static isCircle(v: any): v is Circle {
    return v && typeof v.radius === 'number' && Point.isPoint(v)
  }
}

type IntersectValue = Rect | Circle | Point

const intersectLeft = (a: IntersectValue, b: IntersectValue) => {
  if (Rect.isRect(a)) {
    if (Rect.isRect(b)) {
      return intersectRects(a, b)
    }
    if (Circle.isCircle(b)) {
      return intersectRectCircle(a, b)
    }
    return intersectRectPoint(a, b)
  }
  if (Circle.isCircle(a)) {
    if (Rect.isRect(b)) {
      return intersectRectCircle(b, a)
    }
    if (Circle.isCircle(b)) {
      return intersectCircles(a, b)
    }
    return intersectCirclePoint(a, b)
  }
  return null
}

export const intersect = (a: IntersectValue, b: IntersectValue) => {
  return intersectLeft(a, b) || intersectLeft(b, a)
}

export const intersectRects = (r1: Rect, r2: Rect) => {
  return !(
    r2.x > Rect.right(r1) ||
    Rect.right(r2) < r1.x ||
    r2.y > Rect.bottom(r1) ||
    Rect.bottom(r2) < r1.y
  )
}

export const intersectRectPoint = (r: Rect, p: Point) => {
  if (Rect.isEmpty(r)) {
    return false
  }

  if (p.x >= r.x && p.x < Rect.right(r)) {
    if (p.y >= r.y && p.y < Rect.bottom(r)) {
      return true
    }
  }
}

export const intersectRectCircle = (r: Rect, c: Circle) => {
  const deltaX = c.x - Math.max(r.x, Math.min(c.x, r.x + r.width))
  const deltaY = c.y - Math.max(r.y, Math.min(c.y, r.y + r.height))
  return deltaX * deltaX + deltaY * deltaY < c.radius * c.radius
}

export const intersectCircles = (c1: Circle, c2: Circle) => {
  const deltaX = c1.x - c2.x
  const deltaY = c2.y - c1.y
  const radii = c1.radius + c2.radius
  return deltaX * deltaX + deltaY * deltaY <= radii * radii
}

export const intersectCirclePoint = (c: Circle, p: Point) => {
  return intersectCircles(c, { ...p, radius: 0 })
}
