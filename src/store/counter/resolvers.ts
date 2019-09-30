export type CounterState = number

// Editing this to for example `state + 2` should not reset the state
export const increment = (state: CounterState) => (): CounterState => state + 1

export const decrement = (state: CounterState) => (): CounterState => state - 1

export const add = (state: CounterState) => (amount: number): CounterState =>
  state + amount
