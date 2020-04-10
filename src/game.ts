import 'setup/pixiSettings'
import { Engine, FrameTickProvider, Entity } from '@ash.ts/ash'
import { GameStateComponent } from 'components'
import { Viewport } from 'const/types'
import { designWidth, designHeight } from 'setup/dimensions'
import { createBird } from 'entities/BirdEntity'
import { RenderSystem } from 'systems/RenderSystem'
import { SystemPriorities } from 'systems/SystemPriorities'
import { MovementSystem } from 'systems/MovementSystem'
import { ControlSystem } from 'systems/ControlSystem'
import { createMap } from 'entities/MapEntity'
import { UpdateSystem } from 'systems/UpdateSystem'

export async function initialiseGame(container: HTMLElement) {
  const viewport: Viewport = {
    width: designWidth,
    height: designHeight,
    top: 0,
    bottom: designHeight,
  }
  const engine = new Engine()
  const tickProvider = new FrameTickProvider()

  engine.addEntity(createBird())
  engine.addEntity(createMap())

  tickProvider.add(delta => engine.update(delta))
  tickProvider.start()

  engine.addSystem(new ControlSystem(), SystemPriorities.move)
  engine.addSystem(new MovementSystem(viewport), SystemPriorities.move)
  engine.addSystem(new UpdateSystem(viewport), SystemPriorities.updatable)
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
