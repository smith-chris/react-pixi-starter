import { combineReducers } from 'redux'
import { counterReducer } from './counter/counter'
import { rotationReducer } from './rotation/rotation'

export const rootReducer = combineReducers({
  counter: counterReducer,
  rotation: rotationReducer,
})
