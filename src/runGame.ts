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
import bunnysImage from 'assets/bunnys.png'
// import { Sprite, Math2 } from 'pixi.js'

// $(document).ready(onReady)

export const runGame = () => {
  onLoad(async () => {
    // console.log('Game Loaded')
    // const containerElement = document.getElementById('canvas')
    // if (!containerElement) {
    //   console.log('No container element found! Initialization aborted')
    //   return
    // }
    // await initialiseGame(containerElement)

    // $(window).resize(resize)
    // window.onorientationchange = resize

    let width = 480
    let height = 320

    // let wabbitTexture
    // let pirateTexture

    let bunnys = []
    let gravity = 0.5 //1.5 ;

    let maxX = width
    let minX = 0
    let maxY = height
    let minY = 0

    let startBunnyCount = 2
    let isAdding = false
    let count = 0
    // let container
    // let pixiLogo
    // let clickImage

    let amount = 100

    // renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0xffffff })
    // stage = new PIXI.Stage(0xffffff)

    const containerElement = document.getElementById(
      'canvas',
    ) as HTMLCanvasElement
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      view: containerElement,
    })
    const renderer = app.renderer
    // const sprite = Sprite.from(bunnysImage.src)

    // const container = new PIXI.Container()

    // app.stage.addChild(container)
    const stage = app.stage

    // container.addChild(sprite)
    // app.ticker.add(delta => {
    //   // rotate the container!
    //   // use delta to create frame-independent transform
    //   container.rotation -= 0.01 * delta
    // })
    // document.body.appendChild(app.view)
    //stage.filterArea = new PIXI.math.Rectangle(0, 0, 800 ,600);

    amount = 100
    //
    //	bloom = new PIXI.filters.BloomFilter();
    //stage.filters = [bloom];

    // renderer.view.style['transform'] = 'translatez(0)'
    //alert(amount)
    // document.body.appendChild(renderer.view)
    // renderer.view.style.position = 'absolute'
    // stats = new Stats()

    // document.body.appendChild(stats.domElement)
    // stats.domElement.style.position = 'absolute'
    // stats.domElement.style.top = '0px'
    requestAnimationFrame(update)

    const wabbitTexture = await PIXI.Texture.fromImage(bunnysImage.src)

    // counter = document.createElement('div')
    // counter.className = 'counter'
    // document.body.appendChild(counter)

    // const pixiLogo = document.getElementById('pixi')
    // const clickImage = document.getElementById('clickImage')

    count = startBunnyCount
    // counter.innerHTML = count + ' BUNNIES'

    // container = new PIXI.DisplayObjectContainer()
    const container = new PIXI.particles.ParticleContainer(200000, {
      position: true,
      rotation: false,
      uvs: false,
      alpha: false,
      scale: false,
    })
    stage.addChild(container)
    //let filter = new PIXI.filters.ColorMatrixFilter();

    const bunny1 = new PIXI.Texture(
      wabbitTexture.baseTexture,
      new PIXI.Rectangle(2, 47, 26, 37),
    )
    const bunny2 = new PIXI.Texture(
      wabbitTexture.baseTexture,
      new PIXI.Rectangle(2, 86, 26, 37),
    )
    const bunny3 = new PIXI.Texture(
      wabbitTexture.baseTexture,
      new PIXI.Rectangle(2, 125, 26, 37),
    )
    const bunny4 = new PIXI.Texture(
      wabbitTexture.baseTexture,
      new PIXI.Rectangle(2, 164, 26, 37),
    )
    const bunny5 = new PIXI.Texture(
      wabbitTexture.baseTexture,
      new PIXI.Rectangle(2, 2, 26, 37),
    )

    const bunnyTextures = [bunny1, bunny2, bunny3, bunny4, bunny5]
    let bunnyType = 2
    let currentTexture = bunnyTextures[bunnyType]

    for (let i = 0; i < startBunnyCount; i++) {
      let bunny = new PIXI.Sprite(currentTexture)
      bunny.speedX = Math.random() * 10
      bunny.speedY = Math.random() * 10 - 5

      bunny.anchor.x = 0.5
      bunny.anchor.y = 1

      bunnys.push(bunny)

      //	bunny.filters = [filter];
      //	bunny.position.x = Math.random() * 800;
      //	bunny.position.y = Math.random() * 600;

      container.addChild(bunny)
    }

    // $(renderer.view).mousedown(function() {
    //   isAdding = true
    // })

    // $(renderer.view).mouseup(function() {
    //   bunnyType++
    //   bunnyType %= 5
    //   currentTexture = bunnyTextures[bunnyType]

    //   isAdding = false
    // })

    document.addEventListener('touchstart', onTouchStart, true)
    document.addEventListener('touchend', onTouchEnd, true)

    function onTouchStart() {
      isAdding = true
    }

    function onTouchEnd() {
      bunnyType++
      bunnyType %= 5
      currentTexture = bunnyTextures[bunnyType]

      isAdding = false
      console.log('Bunnys amount', amount)
    }

    // function resize() {
    //   let width = $(window).width()
    //   let height = $(window).height()

    //   if (width > 800) width = 800
    //   if (height > 600) height = 600

    //   maxX = width
    //   minX = 0
    //   maxY = height
    //   minY = 0

    //   let w = $(window).width() / 2 - width / 2
    //   let h = $(window).height() / 2 - height / 2

    //   renderer.view.style.left = $(window).width() / 2 - width / 2 + 'px'
    //   renderer.view.style.top = $(window).height() / 2 - height / 2 + 'px'

    //   stats.domElement.style.left = w + 'px'
    //   stats.domElement.style.top = h + 'px'

    //   counter.style.left = w + 'px'
    //   counter.style.top = h + 49 + 'px'

    //   pixiLogo.style.right = w + 'px'
    //   pixiLogo.style.bottom = h + 8 + 'px'

    //   clickImage.style.right = w + 108 + 'px'
    //   clickImage.style.bottom = h + 17 + 'px'

    //   renderer.resize(width, height)
    // }

    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    function update() {
      // stats.begin()
      if (isAdding) {
        // add 10 at a time :)

        if (count < 200000) {
          for (let i = 0; i < amount; i++) {
            let bunny = new PIXI.Sprite(currentTexture)
            bunny.speedX = Math.random() * 10
            bunny.speedY = Math.random() * 10 - 5
            bunny.anchor.y = 1
            //bunny.alpha = 0.3 + Math.random() * 0.7;
            bunnys.push(bunny)
            bunny.scale.set(0.5 + Math.random() * 0.5)

            bunny.rotation = Math.random() - 0.5

            //bunny.rotation = Math.random() - 0.5;
            // let random = getRandomInt(0, container.children.length - 2)
            container.addChild(bunny) //, random);

            count++
          }
        }

        // counter.innerHTML = count + ' BUNNIES'
      }

      for (let i = 0; i < bunnys.length; i++) {
        let bunny = bunnys[i]
        //bunny.rotation += 0.1

        bunny.position.x += bunny.speedX
        bunny.position.y += bunny.speedY
        bunny.speedY += gravity

        if (bunny.position.x > maxX) {
          bunny.speedX *= -1
          bunny.position.x = maxX
        } else if (bunny.position.x < minX) {
          bunny.speedX *= -1
          bunny.position.x = minX
        }

        if (bunny.position.y > maxY) {
          bunny.speedY *= -0.85
          bunny.position.y = maxY
          bunny.spin = (Math.random() - 0.5) * 0.2
          if (Math.random() > 0.5) {
            bunny.speedY -= Math.random() * 6
          }
        } else if (bunny.position.y < minY) {
          bunny.speedY = 0
          bunny.position.y = minY
        }
      }

      renderer.render(stage)
      requestAnimationFrame(update)
      // stats.end()
    }
    update()
  })
}
