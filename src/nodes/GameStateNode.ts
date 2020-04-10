import { Node, keep } from '@ash.ts/ash'
import { GameStateComponent } from 'components'

export class GameStateNode extends Node {
  @keep(GameStateComponent)
  public state!: GameStateComponent
}
