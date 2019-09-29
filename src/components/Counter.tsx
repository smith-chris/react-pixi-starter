import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { counterActions } from 'store/counter/counter'
import { State } from 'store/configureStore'

const mapStateToProps = (state: State) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(counterActions, dispatch)
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

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
    return (
      <p>
        Clicked: {counter} times <button onClick={() => increment()}>+</button>{' '}
        <button onClick={() => decrement()}>-</button>{' '}
        <button onClick={this.incrementIfOdd}>Increment if odd</button>{' '}
        <button onClick={this.incrementAsync}>Increment async</button>
      </p>
    )
  }
}

export const Counter = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CounterComponent)
