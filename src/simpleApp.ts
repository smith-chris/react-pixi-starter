import * as PIXI from 'pixi.js'
import bunny from 'assets/bunny.png'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

const pixelRatio = 1
const getWidth = () => window.innerWidth * pixelRatio
const getHeight = () => window.innerHeight * pixelRatio

const pixelRatio2 = window.devicePixelRatio || 1

const app = new PIXI.Application({
  width: getWidth(),
  height: getHeight(),
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1,
  view: canvas,
})
// document.body.appendChild(app.view)

const container = new PIXI.Container()

app.stage.addChild(container)

// Create a new texture
const texture = PIXI.Texture.from(bunny.src)

// Create a 5x5 grid of bunnies
for (let i = 0; i < 25; i++) {
  const bunny = new PIXI.Sprite(texture)
  bunny.anchor.set(0.5)
  bunny.x = (i % 5) * 40
  bunny.y = Math.floor(i / 5) * 40
  container.addChild(bunny)
}

// Move container to the center
container.x = app.screen.width / (2 * pixelRatio2)
container.y = app.screen.height / (2 * pixelRatio2)

// Center bunny sprite in local container coordinates
container.pivot.x = container.width / 2
container.pivot.y = container.height / 2

// Listen for animate update
app.ticker.add(delta => {
  // rotate the container!
  // use delta to create frame-independent transform
  container.rotation -= 0.01 * delta
})
