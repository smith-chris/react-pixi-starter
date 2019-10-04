import React from 'react'
// import './utils/checkAsync'
import { RotatingBunny } from 'components/RotatingBunny'
import { Bunnies } from 'components/Bunnies'
import { ConnectedBunny } from 'components/ConnectedBunny'
import { Texture, BaseTexture, Rectangle, Point } from 'pixi.js'
import { Sprite, BitmapText } from '@inlet/react-pixi'
import { designWidth, designHeight } from 'config/pixiApp'
import { AutoCounter } from 'components/AutoCounter'
import { Counter } from 'components/Counter'

const font = { name: 'PICO-8', size: 30 }

const App = () => (
  <>
    <Bunnies />
    <RotatingBunny x={450} y={300} />
    <ConnectedBunny x={450} y={550} />
    {/* <AutoCounter /> */}
    {/* <Counter /> */}
    {/* <Sprite texture={A} anchor={new Point(0.5)} x={designWidth/2} y={designHeight/2}/> */}
    <BitmapText
      y={designHeight * 0.1}
      anchor={new Point(0, 0.5)}
      text="Hello"
      style={{ font }}
    />
    <BitmapText
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
    />
  </>
)

export default App
