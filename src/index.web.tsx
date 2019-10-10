// import './config/webglPolyfill'
import { setConfig } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'

setConfig({
  showReactDomPatchNotification: false,
})

import App from './App'
import 'config/picoFont'
import { configureStore } from 'store/configureStore'
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
