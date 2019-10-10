import { hot } from 'react-hot-loader/root'
import React from 'react'
import { RotatingBunny } from 'components/RotatingBunny'

export const Bunnies = () => (
  <>
    {/* Editing props here should not affect the Bunny on the right. Aka it should preserve its rotation */}
    <RotatingBunny x={150} y={300} />
    <RotatingBunny x={150} y={550} />
  </>
)

export const BunniesHot = hot(Bunnies)
