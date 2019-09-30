import React, { Component, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { counterActions } from 'store/counter/counter'
import { State } from 'store/configureStore'
import { Text } from '@inlet/react-pixi'

const mapStateToProps = (state: State) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(counterActions, dispatch)
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

const Button: FunctionComponent<{
  onClick: () => void
  x?: number
  y: number
}> = ({ onClick, children, x = 300, y }) => (
  <Text
    text={String(children)}
    x={x}
    y={y}
    anchor={0.5}
    interactive
    pointerdown={onClick}
  />
)

class CounterComponent extends Component<Props> {
  incrementIfOdd = () => {
    if (this.props.counter % 2 !== 0) {
      this.props.increment()
    }
  }

  incrementAsync = () => {
    setTimeout(() => this.props.increment(), 1000)
  }

  render() {
    const { counter, increment, decrement } = this.props
    let i = 1.5
    const distY = 32
    return (
      <>
        <Text
          y={++i * distY}
          x={300}
          anchor={0.5}
          text={`Clicked: ${counter} times`}
        />
        <Button x={290} y={++i * distY} onClick={() => decrement()}>
          -
        </Button>
        <Button x={310} y={i * distY} onClick={() => increment()}>
          +
        </Button>
        <Button y={++i * distY} onClick={this.incrementIfOdd}>
          Increment if odd
        </Button>
        <Button y={++i * distY} onClick={this.incrementAsync}>
          Increment async
        </Button>
      </>
    )
  }
}

export const Counter = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CounterComponent)
