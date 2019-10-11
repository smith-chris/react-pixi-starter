import React, { Component } from 'react'
import { Typography } from './Typography'

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
    // Editing this should not affect this.state.count while HMR
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
      <Typography anchor={0.5} x={300} y={800 - 100}>
        {this.state.count} - {this.generateString1()} - {this.generateString2()}
      </Typography>
    )
  }
}
