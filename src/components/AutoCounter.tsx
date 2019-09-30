import React, { Component } from 'react'
import { Text } from '@inlet/react-pixi'

export class AutoCounter extends Component<{}, { count: number }> {
  interval!: number

  constructor(props: {}) {
    super(props)
    this.state = { count: 0 }
  }

  componentDidMount() {
    this.interval = window.setInterval(
      () => this.setState(prevState => ({ count: prevState.count + 1 })),
      200,
    )
  }

  generateString1() {
    return '1'
  }

  generateString2 = () => {
    return '2'
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <Text
        anchor={0.5}
        x={300}
        y={80}
        text={`${
          this.state.count
        } - ${this.generateString1()} - ${this.generateString2()}`}
      />
    )
  }
}
