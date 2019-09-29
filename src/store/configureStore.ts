import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from './rootReducer'

export type State = ReturnType<typeof rootReducer>

export const configureStore = () => {
  const store = createStore(rootReducer, composeWithDevTools())

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(rootReducer))
  }

  return store
}
