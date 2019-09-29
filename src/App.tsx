import { hot } from 'react-hot-loader/root'
import React from 'react'
import { RotatingBunny } from 'Bunny'

const App = () => <RotatingBunny />

export default App

// export default hot(App)
;(async () => {
  console.log(
    'You have async support if you read this instead of "ReferenceError: regeneratorRuntime is not defined" error.',
  )
})()
