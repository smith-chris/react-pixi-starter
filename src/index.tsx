import './webglPolyfill'
import React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'

import { configureStore } from 'store/configureStore'
import App from './App'
import { pixiApp } from 'pixiApp'
import * as PIXI from 'pixi.js'
window.PIXI = PIXI
const t = PIXI.resources.BaseImageResource.crossOrigin
PIXI.resources.BaseImageResource.crossOrigin = function(...params) {
  console.log('calling crossOrigin with', params)
  if (typeof params[1] !== 'string') {
    return
    if (params[1].toDataURL) {
      params[1] = params[1].toDataURL()
      console.log('canvas to', params[1])
    }
  }
  console.log('post', params)
  const res = t.apply(this, params)
  return res
}

const store = configureStore()

const renderApp = () => {
  render(
    <Provider store={store}>
      <AppProvider value={pixiApp}>
        <App />
      </AppProvider>
    </Provider>,
    pixiApp.stage,
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
