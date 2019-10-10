// import './utils/checkAsync'
import { hot } from 'react-hot-loader/root'
import React, { ComponentProps } from 'react'

import { RotatingBunny } from 'components/RotatingBunny'
import { Bunnies } from 'components/Bunnies'
import { ConnectedBunny } from 'components/ConnectedBunny'
import { Texture, BaseTexture, Rectangle, Point } from 'pixi.js'
import {
  Sprite,
  BitmapText,
  Stage,
  AppProvider,
  Container,
} from '@inlet/react-pixi'
import { designWidth, designHeight, getSizeProps } from 'config/pixiApp'
import { AutoCounter } from 'components/AutoCounter'
import { Counter } from 'components/Counter'
import { AutoResizeStage } from 'components/AutoResizeStage'

const font = { name: 'PICO-8', size: 30 }

const App = () => (
  <>
    <AutoResizeStage>
      <Bunnies />
      <RotatingBunny x={450} y={300} />
      {/* <ConnectedBunny x={450} y={550} /> */}
      {/* <Counter /> */}
      <AutoCounter />
      <BitmapText
        y={designHeight * 0.1}
        anchor={new Point(0, 0.5)}
        text="Hello"
        style={{ font }}
      />
      {/* <BitmapText
        y={designHeight * 0.1}
        x={designWidth / 2}
        anchor={0.5}
        text="Hello"
        style={{ font }}
      />
      <BitmapText
        y={designHeight * 0.1}
        x={designWidth}
        anchor={new Point(1, 0.5)}
        text="Hello"
        style={{ font }}
      /> */}
    </AutoResizeStage>
  </>
)

// export default App
export default hot(App)
