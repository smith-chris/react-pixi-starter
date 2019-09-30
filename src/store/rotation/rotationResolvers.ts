export type RotationState = {
  angle: number
  speed: number
}

// Editing this to for example `state + 2` should not reset the state
export const updateRotation = (state: RotationState) => (): RotationState => ({
  ...state,
  angle: state.angle + state.speed,
})
