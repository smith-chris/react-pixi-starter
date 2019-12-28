import { ImmerReducer } from 'immer-reducer'
import { makeImmerHook } from './makeImmerHook'
import { designHeight, designWidth } from 'setup/dimensions'
import { debug } from 'utils/const'
import { intersectRects } from 'utils/math'
import birdTexture from 'assets/sprites/yellowbird-midflap.png'

const getVariation = (timePassed: number) => Math.sin(timePassed / 7)

const getY = (timePassed: number) =>
  designHeight / 2 -
  birdTexture.height / 2 +
  Math.round(getVariation(timePassed) * 5)

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

type Rct = { width: number; x: number; y: number; height: number; anchor?: any }

const pipes: Array<{
  center: {
    x: number
    y: number
  }
  passed?: boolean
  down: Rct
  up: Rct
}> = []

const initialState = {
  isPlaying: false,
  debug: {
    isPLaying: debug,
    freeze: false,
  },
  velocity: 0,
  timePassed: 0,
  bird: {
    x: designWidth / 4,
    y: getY(0),
    width: birdTexture.width - 1,
    height: birdTexture.height,
  },
  rotation: 0,
  textureName: 'mid' as BirdTexture,
  viewportLeft: 0,
  score: 0,
  pipes,
}

export type GameState = typeof initialState

// TODO: get it from texture
export const pipeWidth = require('assets/sprites/pipe-green.png').width
export const pipeHeight = require('assets/sprites/pipe-green.png').height
export const pipeGap = debug ? 60 : 120
export const birdRadius = 27

class GameReducer extends ImmerReducer<GameState> {
  onTouch() {
    const { draftState: ds } = this
    if (!ds.isPlaying) {
      ds.isPlaying = true
      if (debug) {
        ds.debug.isPLaying = true
      }
      ds.bird = initialState.bird
      ds.timePassed = 0
      ds.viewportLeft = 0
    }
    ds.velocity = 6
  }

  gameOver() {
    const { draftState: ds } = this
    if (!debug) {
      ds.isPlaying = false
      ds.score = 0
      ds.pipes = []
    } else {
      ds.debug.freeze = true
    }
  }

  update(delta?: number) {
    delta = delta || 1000 / 60
    const { draftState: ds } = this
    if (ds.isPlaying || (ds.debug.isPLaying && !ds.debug.freeze)) {
      ds.viewportLeft += delta
      ds.bird.x += delta
      const viewportRight = ds.viewportLeft + designWidth
      const lastPipe = ds.pipes.length && ds.pipes[ds.pipes.length - 1]
      const startPiping = ds.viewportLeft > 50
      const needsPipe =
        !lastPipe || lastPipe.center.x < viewportRight - pipeDist
      if (startPiping && needsPipe) {
        const center = {
          x: Math.round(viewportRight),
          y: Math.round(designHeight / 2 - Math.random() * 100),
        }
        ds.pipes = ds.pipes.filter(
          ({ center: { x } }) => x + pipeWidth > ds.viewportLeft,
        )
        ds.pipes.push({
          center,
          down: {
            x: center.x,
            y: center.y + pipeGap / 2,
            width: pipeWidth,
            height: pipeHeight,
          },
          up: {
            x: center.x,
            y: center.y - pipeGap / 2 - pipeHeight,
            width: pipeWidth,
            height: pipeHeight,
          },
        })
      }
    }
    ds.timePassed += delta
    ds.textureName = getTextureName(ds.timePassed)
    if (ds.isPlaying || ds.debug.isPLaying) {
      if (ds.bird.y + 12 > designHeight) {
        this.gameOver()
      }
      if (!debug) {
        // gravity only while not debugging
        ds.velocity -= 0.25
        ds.bird.y -= ds.velocity
        ds.rotation = getRotation(ds.velocity)
      }
      ds.pipes = ds.pipes.map(p => {
        if (!p.passed && ds.bird.x > p.center.x + pipeWidth) {
          ds.score++
          return { ...p, passed: true }
        }
        return p
      })
      // Collision
      const overlapingPipes = ds.pipes.filter(({ down, up }) => {
        return intersectRects(down, ds.bird) || intersectRects(up, ds.bird)
      })
      if (overlapingPipes.length) {
        this.gameOver()
      }
    } else {
      ds.bird.y = getY(ds.timePassed)
      ds.rotation = 0
    }
  }
}

export const useGameReducer = makeImmerHook(GameReducer, initialState)

export type GameHook = ReturnType<typeof useGameReducer>
