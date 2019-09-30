import React from 'react'
import './utils/checkAsync'
import { RotatingBunny } from 'components/RotatingBunny'
import { Bunnies } from 'components/Bunnies'
import { AutoCounter } from 'components/AutoCounter'
import { Counter } from 'components/Counter'

const App = () => (
  <>
    <Bunnies />
    <RotatingBunny x={450} />
    <AutoCounter />
    <Counter />
  </>
)

export default App
