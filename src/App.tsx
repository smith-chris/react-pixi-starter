import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { AutoCounter } from './components/AutoCounter'
import { Counter } from 'components/Counter'

const App = () => (
  <div>
    <h1>Hello, world!!</h1>
    <Counter />
    <br />
    <AutoCounter />
  </div>
)
;(async () => {
  console.log(
    'You have async support if you read this instead of "ReferenceError: regeneratorRuntime is not defined" error.',
  )
})()

export default hot(App)
