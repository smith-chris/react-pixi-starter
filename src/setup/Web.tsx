import React from 'react'
import { AutoResizeStage } from 'components/AutoResizeStage'
import { Game } from 'Game'

import { Provider } from 'react-redux'
import { configureStore } from 'store/configureStore'
import { hot } from 'react-hot-loader/root'

const store = configureStore()

const HotGame = hot(Game)

export const Web = () => (
  <AutoResizeStage>
    <Provider store={store}>
      <HotGame />
    </Provider>
  </AutoResizeStage>
)
