import { useReducer, useMemo, Dispatch } from 'react'
import {
  ImmerReducerState,
  createActionCreators,
  createReducerFunction,
  ImmerReducerClass,
} from 'immer-reducer'

export const makeImmerHook = <
  T extends ImmerReducerClass,
  U extends ImmerReducerState<T>
>(
  reducerClass: T,
  initialState: U,
) => {
  const actions = createActionCreators(reducerClass)
  const reducer = createReducerFunction(reducerClass, initialState)

  const wrapActionsWithDispatch = (dispatch: Dispatch<any>) =>
    Object.entries(actions).reduce(
      (acc, [key, action]: [string, any]) => ({
        ...acc,
        [key]: (...params: any[]) => dispatch(action(...params)),
      }),
      {},
    )

  return () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return [
      state,
      useMemo(() => wrapActionsWithDispatch(dispatch), [dispatch]),
    ] as [typeof state, typeof actions]
  }
}
