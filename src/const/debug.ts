export const debug = true

if (debug) {
  window.PIXI = require('pixi.js')
}

// @ts-ignore
window.log = (...params: any[]) => {
  if (debug) {
    console.log(...params)
  }
}
