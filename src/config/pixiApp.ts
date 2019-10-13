import { Application } from 'pixi.js'
import debounce from 'lodash.debounce'
import { pixelRatio } from './const'
import { getSizeProps } from './getSizeProps'

export const hexColor = {
  brand: 0xeaad64,
  aqua: 0x9bedf9,
  yellow: 0xffe337,
  black: 0x000000,
  white: 0xffffff,
  raspberry: 0xfb264e,
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement

const getWidth = () => window.innerWidth * pixelRatio
const getHeight = () => window.innerHeight * pixelRatio

export const pixiApp = new Application({
  width: getWidth(),
  height: getHeight(),
  backgroundColor: hexColor.yellow,
  view: canvas,
})

const { stage, renderer } = pixiApp

const onResize = () => {
  const sizeProps = getSizeProps({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  Object.assign(stage, sizeProps.stage)

  renderer.resize(sizeProps.renderer.width, sizeProps.renderer.height)
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
}
onResize()

window.addEventListener('resize', ejecta ? onResize : debounce(onResize, 300))
