import { System, Engine, NodeList } from '@ash.ts/ash'
import { GameStateNode } from 'nodes'
import { BirdNode } from 'entities/BirdEntity'
import { eachNode } from './systemUtils'
import { Body } from 'matter-js'

export class ControlSystem extends System {
  private games!: NodeList<GameStateNode>
  private birds!: NodeList<BirdNode>

  addToEngine(engine: Engine) {
    this.games = engine.getNodeList(GameStateNode)
    this.birds = engine.getNodeList(BirdNode)
    window.addEventListener('pointerdown', this.onTouch)
    window.addEventListener('touchstart', this.onTouch)
  }
  removeFromEngine() {
    window.removeEventListener('pointerdown', this.onTouch)
    window.removeEventListener('touchstart', this.onTouch)
  }
  onTouch = () => {
    const state = this.games?.head?.state
    if (!state) {
      return
    }
    state.playing = true
    // Shouldn't this be a signal listener?
    eachNode(
      this.birds,
      ({ state: { entityStateMachine }, body: { body } }) => {
        console.log('change state to playing')
        entityStateMachine.changeState('playing')
        // Make it jump
        Body.setVelocity(body, { x: 0, y: -6 })
      },
    )
  }
  update() {}
}
