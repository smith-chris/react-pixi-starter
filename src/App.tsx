import { hot } from 'react-hot-loader/root'
import React from 'react'

import { RotatingBunny } from 'components/RotatingBunny'
import { Bunnies } from 'components/Bunnies'
import { Point } from 'pixi.js'
import { designWidth, designHeight } from 'config/size'
import { AutoCounter } from 'components/AutoCounter'
import { ConnectedBunny } from 'components/ConnectedBunny'
import { Counter } from 'components/Counter'
import { Typography } from 'components/Typography'

const App = () => (
  <>
    <Bunnies />
    <RotatingBunny x={450} y={300} />
    <ConnectedBunny x={450} y={550} />
    <Counter />
    <AutoCounter />
    <Typography y={designHeight * 0.1} anchor={new Point(0, 0.5)}>
      Hello
    </Typography>
    <Typography
      y={designHeight * 0.1}
      x={designWidth}
      anchor={new Point(1, 0.5)}
    >
      World
    </Typography>
  </>
)

export default hot(App)
