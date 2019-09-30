import React from 'react'
import { RotatingBunny } from 'RotatingBunny'

export const Bunnies = () => (
  <>
    {/* Editing props here should not affect the Bunny on the right. Aka it should preserve its rotation */}
    <RotatingBunny x={150} y={250} />
    <RotatingBunny x={150} y={550} />
  </>
)
