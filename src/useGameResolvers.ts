import { makeResolvers } from 'rezolve'
import { designHeight } from 'setup/dimensions'

const getVariation = (timePassed: number) => Math.sin(timePassed / 7)

const getY = (timePassed: number) =>
  designHeight / 2 + Math.round(getVariation(timePassed) * 5)

const getRotation = (velocity: number) => {
  // Moving upwards
  if (velocity > 0) return Math.max(-0.5, -velocity / 10)
  // Moving downwards
  else if (velocity < 0) return Math.min(1.5, -velocity / 10)
  return 0
}

const getTextureName = (timePassed: number) => {
  const v = getVariation(timePassed)
  if (v > 0.33) return 'up'
  if (v < -0.33) return 'down'
  return 'mid'
}

export type BirdTexture = ReturnType<typeof getTextureName>

const initialState = {
  isPlaying: false,
  velocity: 0,
  timePassed: 0,
  y: designHeight / 2,
  rotation: 0,
  textureName: 'mid' as BirdTexture,
}

export type GameState = typeof initialState

export const useGameResolvers = makeResolvers(
  {
    onTouch: state => () => {
      let { isPlaying, y } = state
      if (!isPlaying) {
        isPlaying = true
        y = getY(state.timePassed)
      }
      return { ...state, isPlaying, y, velocity: 6 }
    },
    update: state => (delta = 0) => {
      let { velocity, timePassed, y, isPlaying, rotation, textureName } = state
      timePassed += delta
      textureName = getTextureName(timePassed)
      if (isPlaying) {
        if (y > designHeight) {
          isPlaying = false
        }
        velocity -= 0.25
        y -= velocity
        rotation = getRotation(velocity)
      } else {
        y = getY(state.timePassed)
        rotation = 0
      }
      return {
        ...state,
        velocity,
        timePassed,
        y,
        isPlaying,
        rotation,
        textureName,
      }
    },
  },
  initialState,
)

export type GameHook = ReturnType<typeof useGameResolvers>
