import 'script-loader!box2d.js/build/Box2D_v2.3.1_min.wasm'
import { debug } from './debug'
export const Box2D = window.Box2D
// if (!debug) {
//   delete window.Box2D
// }
