import { setConfig } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'

setConfig({
  showReactDomPatchNotification: false,
})

import 'config/picoFont'
import { configureStore } from 'store/configureStore'
import { Provider } from 'react-redux'
import { Web } from 'Web'
const store = configureStore()

const rootElement = document.getElementById('game')

console.log('Running Web')

render(
  <Provider store={store}>
    <Web />
  </Provider>,
  rootElement,
)
