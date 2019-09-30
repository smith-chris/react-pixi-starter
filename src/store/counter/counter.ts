import { makeActionCreators, makeReducer } from 'redux-solve'
import { CounterState } from './counterResolvers'
import * as counterResolvers from './counterResolvers'

export const initialState: CounterState = 0

export const counterActions = makeActionCreators(counterResolvers, initialState)
export type CounterActions = typeof counterActions
export const counterReducer = makeReducer(counterResolvers, initialState)
