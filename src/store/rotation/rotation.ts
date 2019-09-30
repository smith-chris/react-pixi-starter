import { makeActionCreators, makeReducer } from 'redux-solve'
import { RotationState } from './rotationResolvers'
import * as rotationResolvers from './rotationResolvers'

export const initialState: RotationState = {
  angle: 0,
  speed: 0.005,
}

export const rotationActions = makeActionCreators(
  rotationResolvers,
  initialState,
)
export const rotationReducer = makeReducer(rotationResolvers, initialState)
