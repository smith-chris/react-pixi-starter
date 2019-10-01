import React from 'react'
// import './utils/checkAsync'
import { RotatingBunny } from 'components/RotatingBunny'
import { Bunnies } from 'components/Bunnies'
import { AutoCounter } from 'components/AutoCounter'
import { Counter } from 'components/Counter'
import { ConnectedBunny } from 'components/ConnectedBunny'

const App = () => (
  <>
    <Bunnies />
    <RotatingBunny x={450} y={300} />
    <ConnectedBunny x={450} y={550} />
    <AutoCounter />
    {/* <Counter /> */}
  </>
)

export default App
