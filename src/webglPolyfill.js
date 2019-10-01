;[
  'WebGLRenderingContext',
  'HTMLVideoElement',
  'HTMLCanvasElement',
  'HTMLImageElement',
].forEach(k => {
  // if (!window[k]) {
  window[k] = function() {
    console.log(`WARNING: Calling polifilled ${k}!`)
  }
  // }
})
// window.WebGLRenderingContext = function() {
//   console.log('WARNING: Calling polifilled WebGLRenderingContext!')
// }
// window.HTMLVideoElement = function() {
//   console.log('WARNING: Calling polifilled HTMLVideoElement!')
// }
const canvas = document.getElementById('canvas')
const _td = document.createElement
document.createElement = function(...params) {
  // console.log('Calling createElement with: ', params)
  const dres = _td.apply(this, params)
  if (params[0] === 'canvas') {
    const _t = dres.getContext
    dres.getContext = function(...params) {
      // console.log('Calling getContext with: ', params)
      // @ts-ignore
      const res = _t.apply(this, params)
      const _t2 = res.getContextAttributes
      res.getContextAttributes = function(...p2) {
        // console.log('Calling getContextAttributes with: ', p2)
        const res2 = _t2.apply(this, p2)
        // console.log('Returning ', res2)
        return { ...res2, stencil: true }
      }
      // console.log('Returning ', res)
      return res
    }
  }
  return dres
}
// console.log(window.WebGLRenderingContext)
// console.log(!window.WebGLRenderingContext)
