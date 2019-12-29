import { ImmerReducer } from 'immer-reducer'
import { makeImmerHook } from './makeImmerHook'
import { designHeight, designWidth } from 'setup/dimensions'
import { debug } from 'utils/debug'
import { intersectRects } from 'utils/math'
import birdTexture from 'assets/sprites/yellowbird-midflap.png'
import baseTexture from 'assets/sprites/base.png'
import { ViewportProps } from 'setup/getSizeProps'
import { Point } from 'pixi.js'

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
  system: {
    scroll: debug,
    gravity: false,
    collision: true,
  },
  isPlaying: false,
  isTouchable: true,
  alive: debug,
  frozen: false,
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
  base: {
    x: 0,
    y: 0,
    anchor: new Point(0, 1),
    offset: 0,
  },
  rotation: 0,
  textureName: 'mid' as BirdTexture,
  viewportLeft: 0,
  score: 0,
  pipes,
}

export type GameState = typeof initialState

export const pipeWidth = require('assets/sprites/pipe-green.png').width
export const pipeHeight = require('assets/sprites/pipe-green.png').height
export const pipeGap = debug ? 60 : 120
export const birdRadius = 27

class GameReducer extends ImmerReducer<GameState> {
  onTouch() {
    const { draftState: ds } = this
    if (ds.isTouchable) {
      if (!ds.isPlaying) {
        ds.isPlaying = true
        ds.system.scroll = true
        ds.system.gravity = true
        ds.system.collision = true
        ds.alive = true
        ds.frozen = false
        if (debug) {
          ds.debug.isPLaying = true
        }
        ds.bird = initialState.bird
        ds.timePassed = 0
        ds.viewportLeft = 0
      }
      ds.velocity = 6
    }
  }

  pipeDeath() {
    log('pipeDeath')
    const { draftState: ds } = this
    if (!ds.frozen) {
      ds.isTouchable = false
      ds.isPlaying = false
      ds.system.scroll = false
      ds.system.gravity = true
      ds.alive = false
    }
  }

  baseDeath() {
    log('baseDeath')
    const { draftState: ds } = this
    this.pipeDeath()
    ds.frozen = true
    ds.system.collision = false
    ds.isTouchable = true
  }

  onViewportChange({ bottom }: ViewportProps) {
    this.draftState.base.y = Math.max(450, bottom)
  }

  update(delta?: number) {
    delta = delta || 1000 / 60
    const { draftState: ds } = this

    ds.timePassed += delta
    ds.textureName = ds.alive ? getTextureName(ds.timePassed) : 'mid'

    if (ds.system.scroll) {
      ds.base.offset = ds.base.offset < -46 ? 0 : ds.base.offset - delta
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

    if (!ds.frozen) {
      if (ds.system.gravity) {
        ds.velocity -= ds.alive ? 0.25 : 0.5
        ds.bird.y -= ds.velocity
        ds.rotation = getRotation(ds.alive ? ds.velocity : ds.velocity * 2)
      } else {
        ds.bird.y = getY(ds.timePassed)
        ds.rotation = 0
      }
    }

    if (ds.system.collision) {
      if (
        intersectRects(
          {
            ...ds.base,
            width: baseTexture.width,
            height: baseTexture.height,
          },
          { ...ds.bird, height: ds.bird.height + 7 },
        )
      ) {
        this.baseDeath()
      }
      ds.pipes = ds.pipes.map(p => {
        if (!p.passed && ds.bird.x > p.center.x + pipeWidth) {
          ds.score++
          return { ...p, passed: true }
        }
        return p
      })
      const overlapingPipes = ds.pipes.filter(({ down, up }) => {
        return intersectRects(down, ds.bird) || intersectRects(up, ds.bird)
      })
      if (overlapingPipes.length) {
        this.pipeDeath()
      }
    }
  }
}

export const useGameReducer = makeImmerHook(GameReducer, initialState)

export type GameHook = ReturnType<typeof useGameReducer>
