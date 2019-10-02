import { Application, settings, SCALE_MODES } from 'pixi.js'
import debounce from 'lodash.debounce'

import { Point } from 'utils/point'

settings.SCALE_MODE = SCALE_MODES.NEAREST

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

export const designWidth = 600
const viewportWidth = designWidth
export const designHeight = designWidth * (1 / designRatio) // 800
const pixelRatio = window.devicePixelRatio || 1
const getWidth = () => window.innerWidth * pixelRatio
const getHeight = () => window.innerHeight * pixelRatio

export const pixiApp = new Application({
  width: getWidth(),
  height: getHeight(),
  backgroundColor: hexColor.yellow,
  view: canvas,
})

const { stage, renderer } = pixiApp

const onResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  const windowRatio = width / height

  const viewportRatio = Math.min(minRatio, Math.max(maxRatio, windowRatio))
  const viewportHeight = Math.round(designWidth * (1 / viewportRatio)) // ranges from 700 to 1300

  let canvasHeight: number, canvasWidth: number
  const exceedsHeight = windowRatio <= maxRatio
  if (exceedsHeight) {
    canvasWidth = width
    canvasHeight = Math.round(width * (1 / viewportRatio))
  } else {
    // widescreen, so based on height
    canvasHeight = height
    canvasWidth = Math.round(height * viewportRatio)
  }
  const renderWidth = canvasWidth * pixelRatio
  const renderHeight = canvasHeight * pixelRatio
  const stageScale = renderWidth / designWidth
  const stageTop = ((viewportHeight - designHeight) / 2) * stageScale
  stage.position.y = stageTop
  Point.set(stage.scale, stageScale)
  renderer.resize(renderWidth, renderHeight)
  console.log(renderWidth)
  canvas.style.width = `${canvasWidth}px`
  canvas.style.height = `${canvasHeight}px`
}
onResize()

// window.addEventListener('resize', ejecta ? onResize : debounce(onResize, 300))
window.addEventListener('resize', true ? onResize : debounce(onResize, 300))
