import { Sprite, Texture } from 'pixi.js'

export class BirdView extends Sprite {
  public constructor(image: ImageAsset) {
    super(Texture.from(image.src))
    this.anchor.set(0.5)
  }
}
