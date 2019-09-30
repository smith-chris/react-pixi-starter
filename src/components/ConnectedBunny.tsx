import React, { Component, FunctionComponent } from 'react'
import { Sprite, useTick } from '@inlet/react-pixi'
import { Point } from 'pixi.js'
import bunny from 'assets/bunny.png'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { State } from 'store/configureStore'
import { rotationActions } from 'store/rotation/rotation'

const mapStateToProps = (state: State) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(rotationActions, dispatch)
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps & { x: number; y?: number }

const BunnyComponent: FunctionComponent<Props> = ({
  x,
  y = 400,
  rotation: { angle },
  updateRotation,
}) => {
  useTick(() => {
    updateRotation()
  })

  return (
    <Sprite
      image={bunny.src}
      x={x}
      interactive
      y={y}
      scale={5}
      rotation={angle}
      anchor={new Point(0.5, 0.5)}
    />
  )
}

export const ConnectedBunny = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BunnyComponent)
