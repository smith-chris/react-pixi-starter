import { Engine, FrameTickProvider, someEngineConst, Entity } from '@ash.ts/ash'
import { Viewport } from './Viewport'
import { KeyPoll } from './KeyPoll'
import {
  ShipSpawnSystem,
  MotionControlSystem,
  MovementSystem,
  RenderSystem,
  SystemPriorities,
} from './systems'
import { GameStateComponent } from 'components'

console.log('Engine const: ', someEngineConst)

export async function initialiseGame(container: HTMLElement) {
  const viewport = new Viewport(container.clientWidth, container.clientHeight)
  const engine = new Engine()
  const keyPoll = new KeyPoll()
  const tickProvider = new FrameTickProvider()

  tickProvider.add(delta => engine.update(delta))
  tickProvider.start()

  engine.addSystem(new ShipSpawnSystem(viewport), SystemPriorities.preUpdate)
  engine.addSystem(new MotionControlSystem(keyPoll), SystemPriorities.update)
  engine.addSystem(new MovementSystem(viewport), SystemPriorities.move)
  engine.addSystem(new RenderSystem(container), SystemPriorities.render)

  const gameEntity = new Entity('game').add(new GameStateComponent())
  engine.addEntity(gameEntity)
}
