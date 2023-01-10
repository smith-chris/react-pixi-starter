;[
  'WebGLRenderingContext',
  'HTMLVideoElement',
  'HTMLCanvasElement',
  'HTMLImageElement',
  'TouchEvent',
  'MouseEvent',
].forEach(k => {
  window[k] = function () {
    console.log(`WARNING: Calling polifilled ${k}!`)
  }
})

console.log('WEBGL POLYFILL')
const canvas = document.getElementById('canvas')
const TMPcreateElement = document.createElement
document.createElement = function (...createElementParams) {
  const createElementResult = TMPcreateElement.apply(this, createElementParams)
  if (createElementParams[0] === 'canvas') {
    const TMPgetContext = createElementResult.getContext
    createElementResult.getContext = function (...getContextParams) {
      const getContextResult = TMPgetContext.apply(this, getContextParams)
      const TMPgetContextAttributes = getContextResult.getContextAttributes
      getContextResult.getContextAttributes = function (
        ...getContextAttributesParams
      ) {
        const getContextAttributesResult = TMPgetContextAttributes.apply(
          this,
          getContextAttributesParams,
        )
        return { ...getContextAttributesResult, stencil: true }
      }
      return getContextResult
    }
  }
  return createElementResult
}

// For phaser ios check (so it equals false)
navigator.userAgent = 'Ejecta/2.1'
