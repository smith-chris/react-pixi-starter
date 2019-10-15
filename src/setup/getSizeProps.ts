import { Point } from 'pixi.js'
import {
  maxRatio,
  designWidth,
  pixelRatio,
  designHeight,
  minRatio,
} from './dimensions'
import { useWindowSize } from 'hooks/useWindowSize'

export const getSizeProps = ({ width = 1, height = 1, ratio = pixelRatio }) => {
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
    width: canvas.width * ratio,
    height: canvas.height * ratio,
  }
  const stageScale = renderer.width / designWidth
  const stage = {
    scale: new Point(stageScale, stageScale),
    position: new Point(0, ((viewportHeight - designHeight) / 2) * stageScale),
  }
  return { canvas, renderer, stage }
}

export const useSize = () => {
  const size = useWindowSize()
  return getSizeProps(size)
}
