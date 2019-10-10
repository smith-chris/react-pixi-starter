// import './config/webglPolyfill'
import React from 'react'
import { render } from 'react-dom'

import App from './App'
import 'config/picoFont'
import { configureStore } from 'store/configureStore'
import { AutoResizeStage } from 'components/AutoResizeStage'
import { Provider } from 'react-redux'
const store = configureStore()

const rootElement = document.getElementById('game')

console.log('Running Web')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
)
