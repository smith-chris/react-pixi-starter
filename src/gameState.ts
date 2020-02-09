import { Flatten } from 'utils/typeUtils'

export const gameState = {
  score: 0,
  playing: false,
  falling: false,
  touchable: true,
  alive: true,
  canCollide: false,
}

export const medals = ['silver', 'bronze', 'gold', 'platinum'] as const

export type Medals = Flatten<typeof medals>

export type GameState = typeof gameState

type FrameData = { movement: number; timePassed: number; delta: number }

export type Update = (state: GameState, frameData: FrameData) => void

export type Responsive = (viewport: {
  top: number
  bottom: number
  extraHeight: number
  viewportHeight: number
  safeTop: number
  base: Phaser.Geom.Rectangle
}) => void
