import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import { configureStore } from 'store/configureStore'

const store = configureStore()

const root = document.getElementById('app')

render(
  <Provider store={store}>
    <App />
  </Provider>,
  root,
)
