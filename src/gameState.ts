export const gameState = {
  playing: false,
  touchable: true,
  alive: true,
}

export type GameState = typeof gameState

type FrameData = { movement: number; timePassed: number; delta: number }

export type Update = (state: GameState, frameData: FrameData) => void

export type Responsive = (viewport: {
  top: number
  bottom: number
  extraHeight: number
  viewportHeight: number
  base: Phaser.Geom.Rectangle
}) => void
