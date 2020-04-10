import { Viewport } from 'const/types'

export interface Updatable {
  update(time: number, viewport: Viewport): void
}

export class UpdatableComponent {
  public constructor(public updatable: Updatable) {}
}
