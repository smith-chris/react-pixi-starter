import { Engine, FrameTickProvider, Entity } from '@ash.ts/ash'
import { KeyPoll } from './utils/KeyPoll'
import {
  ShipSpawnSystem,
  MotionControlSystem,
  MovementSystem,
  RenderSystem,
  SystemPriorities,
} from './systems'
import { GameStateComponent } from 'components'
import { Viewport } from 'const/types'
import { designWidth, designHeight } from 'setup/dimensions'

export async function initialiseGame(container: HTMLElement) {
  const viewport: Viewport = {
    width: designWidth,
    height: designHeight,
    top: 0,
    bottom: designHeight,
  }
  const engine = new Engine()
  const keyPoll = new KeyPoll()
  const tickProvider = new FrameTickProvider()

  tickProvider.add(delta => engine.update(delta))
  tickProvider.start()

  engine.addSystem(new ShipSpawnSystem(viewport), SystemPriorities.preUpdate)
  engine.addSystem(new MotionControlSystem(keyPoll), SystemPriorities.update)
  engine.addSystem(new MovementSystem(viewport), SystemPriorities.move)
  engine.addSystem(
    new RenderSystem(container, viewport),
    SystemPriorities.render,
  )

  const gameEntity = new Entity('game').add(new GameStateComponent())
  engine.addEntity(gameEntity)
}

window.addEventListener('load', async () => {
  const containerElement = document.getElementById('game')
  if (!containerElement) {
    return
  }
  await initialiseGame(containerElement)
})
