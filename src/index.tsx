import './webglPolyfill'
import React from 'react'
import { Provider } from 'react-redux'
import { render, AppProvider } from '@inlet/react-pixi'

import { configureStore } from 'store/configureStore'
import App from './App'
import { pixiApp } from 'pixiApp'

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
