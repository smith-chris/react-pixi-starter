import { ImmerReducer } from 'immer-reducer'
import { makeImmerHook } from './makeImmerHook'
import { designHeight, designWidth } from 'setup/dimensions'
import { Point } from 'pixi.js'

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

const pipeDist = 150

const pipes: Array<{ x: number; y: number }> = []

const initialState = {
  isPlaying: false,
  velocity: 0,
  timePassed: 0,
  bird: { x: designWidth / 3, y: getY(0) },
  rotation: 0,
  textureName: 'mid' as BirdTexture,
  viewportLeft: 0,
  pipes,
}

export type GameState = typeof initialState

// TODO: get it from texture
const pipeWidth = 52

class GameReducer extends ImmerReducer<GameState> {
  onTouch() {
    const { draftState: ds } = this
    if (!ds.isPlaying) {
      ds.isPlaying = true
      ds.bird = initialState.bird
      ds.timePassed = 0
      ds.viewportLeft = 0
    }
    ds.velocity = 6
  }

  update(delta?: number) {
    delta = delta || 1000 / 60
    const { draftState: ds } = this
    if (ds.isPlaying) {
      ds.viewportLeft += delta
      ds.bird.x += delta
      const viewportRight = ds.viewportLeft + designWidth
      const lastPipe = ds.pipes.length && ds.pipes[ds.pipes.length - 1]
      const startPiping = ds.viewportLeft > 50
      const needsPipe = !lastPipe || lastPipe.x < viewportRight - pipeDist
      if (startPiping && needsPipe) {
        const newPipe = {
          x: Math.round(viewportRight),
          y: Math.round(designHeight / 2 - Math.random() * 100),
        }
        ds.pipes = ds.pipes.filter(({ x }) => x + pipeWidth > ds.viewportLeft)
        ds.pipes.push(newPipe)
      }
    }
    ds.timePassed += delta
    ds.textureName = getTextureName(ds.timePassed)
    if (ds.isPlaying) {
      if (ds.bird.y + 12 > designHeight) {
        ds.isPlaying = false
        ds.pipes = []
      }
      ds.velocity -= 0.25
      ds.bird.y -= ds.velocity
      ds.rotation = getRotation(ds.velocity)
    } else {
      ds.bird.y = getY(ds.timePassed)
      ds.rotation = 0
    }
  }
}

export const useGameReducer = makeImmerHook(GameReducer, initialState)

export type GameHook = ReturnType<typeof useGameReducer>
