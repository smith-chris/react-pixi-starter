import Matter from 'matter-js'
// @ts-ignore
import { Mouse } from './MatterMouse'
// @ts-ignore
import { Render } from './MatterRender'

export const MatterRender = Render as typeof Matter.Render
export const MatterMouse = Mouse as typeof Matter.Mouse
