import 'config/webglPolyfill'
import React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'

import { configureStore } from 'store/configureStore'
import { pixiApp } from 'config/pixiApp'
import 'config/picoFont'
import App from './App'

const store = configureStore()

render(
  <Provider store={store}>
    <AppProvider value={pixiApp}>
      <App />
    </AppProvider>
  </Provider>,
  pixiApp.stage,
)
