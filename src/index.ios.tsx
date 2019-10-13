import 'config/webglPolyfill'
// For asynch support
import '@babel/polyfill'
import 'config/setEjectaVariables'
import React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'

import { configureStore } from 'store/configureStore'
import { pixiApp } from 'config/pixiApp'
import 'config/picoFont'
import App from './App'

const store = configureStore()

console.log('Running iOS')

render(
  <Provider store={store}>
    <AppProvider value={pixiApp}>
      <App />
    </AppProvider>
  </Provider>,
  pixiApp.stage,
)
