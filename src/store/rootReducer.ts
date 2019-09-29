import { combineReducers } from 'redux'
import { counterReducer } from './counter/counter'

export const rootReducer = combineReducers({ counter: counterReducer })
