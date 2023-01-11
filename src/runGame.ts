// import 'setup/pixiSettings'
// import { Engine, FrameTickProvider, Entity } from '@ash.ts/ash'
// import { GameStateComponent } from 'components'
// import { Viewport } from 'const/types'
// import { designWidth, designHeight } from 'setup/dimensions'
// import { createBird } from 'entities/BirdEntity'
// import { RenderSystem } from 'systems/RenderSystem'
// import { SystemPriorities } from 'systems/SystemPriorities'
// import { MovementSystem } from 'systems/MovementSystem'
// import { ControlSystem } from 'systems/ControlSystem'
// import { createMap } from 'entities/MapEntity'
// import { UpdateSystem } from 'systems/UpdateSystem'
// import { onLoad } from 'setup/onLoad'

// async function initialiseGame(container: HTMLElement) {
//   console.log('Initializing game 2')
//   const viewport: Viewport = {
//     width: designWidth,
//     height: designHeight,
//     top: 0,
//     bottom: designHeight,
//   }
//   const engine = new Engine()
//   const tickProvider = new FrameTickProvider()
//   console.log('engine ftp')

//   engine.addEntity(createBird())
//   console.log('created bird')
//   engine.addEntity(createMap())
//   console.log('created map')

//   tickProvider.add(delta => {
//     // console.log('updating engine')
//     engine.update(delta)
//   })
//   console.log('calling tickProvider.start()')
//   tickProvider.start()

//   engine.addSystem(new ControlSystem(), SystemPriorities.move)
//   engine.addSystem(new MovementSystem(viewport), SystemPriorities.move)
//   engine.addSystem(new UpdateSystem(viewport), SystemPriorities.updatable)
//   engine.addSystem(
//     new RenderSystem(container, viewport),
//     SystemPriorities.render,
//   )

//   const gameEntity = new Entity('game').add(new GameStateComponent())
//   engine.addEntity(gameEntity)
// }
import * as PIXI from 'pixi.js'
import { onLoad } from 'setup/onLoad'
import base from 'assets/sprites/base.png'
import { Sprite } from 'pixi.js'

export const runGame = () => {
  onLoad(async () => {
    // console.log('Game Loaded')
    // const containerElement = document.getElementById('canvas')
    // if (!containerElement) {
    //   console.log('No container element found! Initialization aborted')
    //   return
    // }
    // await initialiseGame(containerElement)
    const containerElement = document.getElementById(
      'canvas',
    ) as HTMLCanvasElement
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      view: containerElement,
    })
    const sprite = Sprite.from(base.src)

    const container = new PIXI.Container()

    app.stage.addChild(container)

    container.addChild(sprite)
    app.ticker.add(delta => {
      // rotate the container!
      // use delta to create frame-independent transform
      container.rotation -= 0.01 * delta
    })
    // document.body.appendChild(app.view)
  })
}
