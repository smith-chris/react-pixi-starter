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
import { onLoad } from 'setup/onLoad'

async function initialiseGame(container: HTMLCanvasElement) {
  console.log('Initializing game 2', container)
  const viewport: Viewport = {
    width: designWidth,
    height: designHeight,
    top: 0,
    bottom: designHeight,
  }
  const engine = new Engine()
  const tickProvider = new FrameTickProvider()
  console.log('engine ftp')

  engine.addEntity(createMap())
  console.log('created map')
  engine.addEntity(createBird())
  console.log('created bird')

  tickProvider.add(delta => {
    // console.log('updating engine')
    engine.update(delta)
  })
  console.log('calling tickProvider.start()')
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

export const runGame = () => {
  onLoad(async () => {
    initialiseGame(document.getElementById('canvas') as HTMLCanvasElement)
  })
}
