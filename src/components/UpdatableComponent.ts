import { Viewport } from 'const/types'

export type UpdateHandler = (time: number, viewport: Viewport) => void

export class UpdateComponent {
  public constructor(public update: UpdateHandler) {}
}
