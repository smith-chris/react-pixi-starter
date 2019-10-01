let settings = {}
settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true
let supported

/**
 * Helper for checking for WebGL support.
 *
 * @memberof PIXI.utils
 * @function isWebGLSupported
 * @return {boolean} Is WebGL supported.
 */
export function isWebGLSupported() {
  if (typeof supported === 'undefined') {
    supported = (function supported() {
      const contextOptions = {
        stencil: true,
        failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT,
      }

      try {
        if (!window.WebGLRenderingContext) {
          console.log('ret false 1')
          return false
        }

        const canvas = document.createElement('canvas')
        let gl =
          canvas.getContext('webgl', contextOptions) ||
          canvas.getContext('experimental-webgl', contextOptions)

        const success = !!(gl && gl.getContextAttributes().stencil)
        console.log(gl.getContextAttributes())
        console.log('success', success)

        if (gl) {
          const loseContext = gl.getExtension('WEBGL_lose_context')

          if (loseContext) {
            loseContext.loseContext()
          }
        }

        gl = null

        return success
      } catch (e) {
        console.log('ret false 2', e)
        return false
      }
    })()
  }

  return supported
}

console.log('webgl supported', isWebGLSupported())
