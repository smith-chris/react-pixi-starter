import { ImmerReducer } from 'immer-reducer'
import { makeImmerHook } from './hooks/makeImmerHook'

const initialState = {
  user: {
    firstName: 'yo!',
    lastName: 'man',
  },
}

class GameReducer extends ImmerReducer<typeof initialState> {
  setFirstName(firstName: string) {
    this.draftState.user.firstName = firstName
  }

  setLastName(lastName: string) {
    this.draftState.user.lastName = lastName
  }
}

export const useGameState = makeImmerHook(GameReducer, initialState)
