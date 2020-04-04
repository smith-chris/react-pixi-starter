export const debug = true

// @ts-ignore
window.log = (...params: any[]) => {
  if (debug) {
    console.log(...params)
  }
}
