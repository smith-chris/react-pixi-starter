import { Viewport } from 'const/types'

export class ResizeComponent {
  public constructor(public handler: (viewport: Viewport) => void) {}
}
