import { Sprite, Texture } from 'pixi.js'
import midflap from 'assets/sprites/yellowbird-midflap.png'

export class BirdView extends Sprite {
  public constructor() {
    super(Texture.from(midflap.src))
    this.anchor.set(0.5)
  }
}
