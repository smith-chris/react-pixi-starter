import { getSizeProps, SizePropsListener } from 'setup/getSizeProps'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

const listeners: SizePropsListener[] = []

export const responsive = (listener: SizePropsListener) => {
  listeners.push(listener)
  listener(
    getSizeProps({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  )
}

// @ts-ignore
export const onResize = (game = window.game) => {
  if (!game) {
    console.log('No game!')
    return
  }
  const sizeProps = getSizeProps({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  if (game.scale?.baseSize && game.scale?.canvas) {
    game.scale.resize(sizeProps.viewport.width, sizeProps.viewport.height)
  } else {
    log('Postponing resize')
    setTimeout(onResize, 250)
    return
  }
  canvas.style.width = `${sizeProps.canvas.width}px`
  canvas.style.height = `${sizeProps.canvas.height}px`
  listeners.forEach(f => f(sizeProps))
}

window.addEventListener('resize', onResize)
setTimeout(onResize, 50)
