import React from 'react'
import { AutoResizeStage } from 'components/AutoResizeStage'
import App from 'App'

import { Provider } from 'react-redux'
import { configureStore } from 'store/configureStore'

const store = configureStore()

export const Web = () => (
  <AutoResizeStage>
    <Provider store={store}>
      <App />
    </Provider>
  </AutoResizeStage>
)
