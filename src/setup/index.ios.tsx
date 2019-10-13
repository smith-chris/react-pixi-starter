import 'setup/webglPolyfill'
// For asynch support
import '@babel/polyfill'
import 'setup/setEjectaVariables'
import React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'

import { configureStore } from 'store/configureStore'
import { pixiApp } from 'setup/pixiApp'
import 'setup/picoFont'
import Game from '../Game'

const store = configureStore()

render(
  <Provider store={store}>
    <AppProvider value={pixiApp}>
      <Game />
    </AppProvider>
  </Provider>,
  pixiApp.stage,
)
