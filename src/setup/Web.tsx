import React from 'react'
import { AutoResizeStage } from 'components/AutoResizeStage'
import Game from 'Game'

import { Provider } from 'react-redux'
import { configureStore } from 'store/configureStore'

const store = configureStore()

export const Web = () => (
  <AutoResizeStage>
    <Provider store={store}>
      <Game />
    </Provider>
  </AutoResizeStage>
)
