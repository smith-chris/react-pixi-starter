import './webglPolyfill'
import React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'

import { configureStore } from 'store/configureStore'
import App from './App'
import { pixiApp } from 'pixiApp'
import { BitmapText, Texture } from 'pixi.js'
import fontXML from 'assets/font.fnt'
import fontPng from 'assets/font.png'
// @ts-ignore only for Ejecta
import { DOMParser } from 'xmldom'
const parsedXML = new DOMParser().parseFromString(fontXML, 'text/xml')
// console.log(parsedXML.getElementsByTagName('page'))
BitmapText.registerFont(parsedXML, Texture.from(fontPng.src))
// @ts-ignore
if (BitmapText.fonts && !BitmapText.fonts['PICO-8']) {
  // @ts-ignore
  BitmapText.fonts['PICO-8'] = BitmapText.fonts['PICO-8 mono']
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
