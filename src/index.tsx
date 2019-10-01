import './webglPolyfill'
import * as React from 'react'
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

// import './simpleApp'
// import './webglSupported'

// const canvas = document.getElementById('canvas') as HTMLCanvasElement
// const ctx2 = canvas.getContext('webgl')
// console.log(ctx2.getContextAttributes().stencil)
// const ctx = canvas.getContext('webgl', { stencil: true })
// console.log(ctx.getContextAttributes().stencil)
// console.log(ctx === ctx2, Object.is(ctx, ctx2))
// // console.log(ctx.getContextAttributes)
// console.log({ stencil: true })
