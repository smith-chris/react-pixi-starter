import * as React from 'react'
import { Provider } from 'react-redux'
import { render } from '@inlet/react-pixi'
import { Application } from 'pixi.js'

import { configureStore } from 'store/configureStore'
import App from './App'

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

const pixelRatio = window.devicePixelRatio || 1
const getWidth = () => window.innerWidth * pixelRatio
const getHeight = () => window.innerHeight * pixelRatio

const app = new Application({
  width: getWidth(),
  height: getHeight(),
  backgroundColor: hexColor.yellow,
  view: canvas,
})

const renderApp = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    app.stage,
  )
}

renderApp()

// webpack Hot Module Replacement API
if (module.hot) {
  // keep in mind - here you are configuring HMR to accept CHILDREN MODULE
  // while `hot` would configure HMR for the CURRENT module
  module.hot.accept('./App', () => {
    renderApp()
  })
}
