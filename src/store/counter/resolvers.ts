export type CounterState = number

export const increment = (state: CounterState) => (): CounterState => state + 1

export const decrement = (state: CounterState) => (): CounterState => state - 1

export const add = (state: CounterState) => (amount: number): CounterState =>
  state + amount
