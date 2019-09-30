import * as React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'
import { Application, settings, SCALE_MODES } from 'pixi.js'

settings.SCALE_MODE = SCALE_MODES.NEAREST

import { configureStore } from 'store/configureStore'
import App from './App'
import { Point } from 'utils/point'
import debounce from 'lodash.debounce'

const store = configureStore()

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
const app = new Application({
  width: getWidth(),
  height: getHeight(),
  backgroundColor: hexColor.yellow,
  view: canvas,
})

const { stage, renderer } = app

const renderApp = () => {
  render(
    <Provider store={store}>
      <AppProvider value={app}>
        <App />
      </AppProvider>
    </Provider>,
    stage,
  )
}

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
  canvas.style.width = `${canvasWidth}px`
  canvas.style.height = `${canvasHeight}px`
  // renderApp()
}
onResize()
// window.addEventListener('resize', ejecta ? onResize : debounce(onResize, 300))
window.addEventListener('resize', true ? onResize : debounce(onResize, 300))

renderApp()

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept('./App', () => {
    renderApp()
  })
}
