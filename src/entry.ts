import debounce from 'lodash.debounce'
import { Renderer, Container } from 'pixi.js'
import { Point } from 'point'

export const hexColor = {
  brand: 0xeaad64,
  aqua: 0x9bedf9,
  yellow: 0xffe337,
  black: 0x000000,
  white: 0xffffff,
  raspberry: 0xfb264e,
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const maxRatio = 6 / 13
const designRatio = 6 / 8 // 4 / 3
const minRatio = 6 / 7

const designWidth = 600
const viewportWidth = designWidth
const designHeight = designWidth * (1 / designRatio) // 800
const pixelRatio = window.devicePixelRatio || 1
const getWidth = () => window.innerWidth * pixelRatio
const getHeight = () => window.innerHeight * pixelRatio
let _r
if (!canvas) {
  console.warn('Could not find canvas element')
} else {
  _r = new Renderer({
    width: getWidth(),
    height: getHeight(),
    backgroundColor: hexColor.yellow,
    view: canvas,
  })

  const Stage = new Container()

  // const onResize = () => {
  //   const width = window.innerWidth
  //   const height = window.innerHeight

  //   const windowRatio = width / height

  //   const viewportRatio = Math.min(minRatio, Math.max(maxRatio, windowRatio))
  //   const viewportHeight = Math.round(designWidth * (1 / viewportRatio)) // ranges from 700 to 1300

  //   let canvasHeight: number, canvasWidth: number
  //   const exceedsHeight = windowRatio <= maxRatio
  //   if (exceedsHeight) {
  //     canvasWidth = width
  //     canvasHeight = Math.round(width * (1 / viewportRatio))
  //   } else {
  //     // widescreen, so based on height
  //     canvasHeight = height
  //     canvasWidth = Math.round(height * viewportRatio)
  //   }
  //   const renderWidth = canvasWidth * pixelRatio
  //   const renderHeight = canvasHeight * pixelRatio
  //   const StageScale = renderWidth / designWidth
  //   const StageTop = ((viewportHeight - designHeight) / 2) * StageScale
  //   Stage.position.y = StageTop
  //   Point.set(Stage.scale, StageScale)
  //   renderer.resize(renderWidth, renderHeight)
  //   canvas.style.width = `${canvasWidth}px`
  //   canvas.style.height = `${canvasHeight}px`
  // }
  // onResize()
  // // window.addEventListener('resize', ejecta ? onResize : debounce(onResize, 300))
  // window.addEventListener('resize', true ? onResize : debounce(onResize, 300))

  // const update = () => {
  //   renderer.render(Stage)
  //   requestAnimationFrame(update)
  // }
  // update()
}

export const renderer = _r
