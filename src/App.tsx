import React from 'react'
import './utils/checkAsync'
import { RotatingBunny } from 'RotatingBunny'
import { Bunnies } from 'Bunnies'

const App = () => (
  <>
    <Bunnies />
    <RotatingBunny x={450} />
  </>
)

export default App
