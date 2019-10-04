// import './config/webglPolyfill'
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'

import { configureStore } from 'store/configureStore'
import App from './App'
import { pixiApp } from 'config/pixiApp'
import 'config/picoFont'
import { Stage } from '@inlet/react-pixi'
const store = configureStore()

const rootElement = document.getElementById('game')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
)
