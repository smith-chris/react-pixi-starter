import 'setup/pixiSettings'
import { Engine, FrameTickProvider, Entity } from '@ash.ts/ash'
import { RenderSystem, SystemPriorities, MovementSystem } from './systems'
import { GameStateComponent } from 'components'
import { Viewport } from 'const/types'
import { designWidth, designHeight } from 'setup/dimensions'
import { createBird } from 'entities/BirdEntity'

export async function initialiseGame(container: HTMLElement) {
  const viewport: Viewport = {
    width: designWidth,
    height: designHeight,
    top: 0,
    bottom: designHeight,
  }
  const engine = new Engine()
  const tickProvider = new FrameTickProvider()
  const bird = createBird()

  engine.addEntity(bird)

  tickProvider.add(delta => engine.update(delta))
  tickProvider.start()

  engine.addSystem(
    new RenderSystem(container, viewport),
    SystemPriorities.render,
  )
  engine.addSystem(new MovementSystem(viewport), SystemPriorities.move)

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
