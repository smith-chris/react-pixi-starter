import { settings, SCALE_MODES, Point } from 'pixi.js'

settings.SCALE_MODE = SCALE_MODES.NEAREST

const maxRatio = 6 / 13
const designRatio = 6 / 8 // 4 / 3
const minRatio = 6 / 7

export const designWidth = 600
const viewportWidth = designWidth
export const designHeight = designWidth * (1 / designRatio) // 800
const pixelRatio = window.devicePixelRatio || 1

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
