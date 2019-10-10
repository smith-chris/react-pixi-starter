import { Application, settings, SCALE_MODES, Point } from 'pixi.js'
import debounce from 'lodash.debounce'

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

export const getSizeProps = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  const sizeRatio = width / height

  const viewportRatio = Math.min(minRatio, Math.max(maxRatio, sizeRatio))
  const viewportHeight = Math.round(designWidth * (1 / viewportRatio)) // ranges from 700 to 1300

  const canvas = { width: 0, height: 0 }
  const exceedsHeight = sizeRatio <= maxRatio
  if (exceedsHeight) {
    canvas.width = width
    canvas.height = Math.round(width * (1 / viewportRatio))
  } else {
    // widescreen, so based on height
    canvas.height = height
    canvas.width = Math.round(height * viewportRatio)
  }
  const renderer = {
    width: canvas.width * pixelRatio,
    height: canvas.height * pixelRatio,
  }
  const stageScale = renderer.width / designWidth
  const stage = {
    scale: new Point(stageScale, stageScale),
    position: new Point(0, ((viewportHeight - designHeight) / 2) * stageScale),
  }
  return { canvas, renderer, stage }
}

const onResize = () => {
  const sizeProps = getSizeProps({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  Object.assign(stage, sizeProps.stage)

  renderer.resize(sizeProps.renderer.width, sizeProps.renderer.height)
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
}
onResize()

// window.addEventListener('resize', ejecta ? onResize : debounce(onResize, 300))
window.addEventListener('resize', true ? onResize : debounce(onResize, 300))
