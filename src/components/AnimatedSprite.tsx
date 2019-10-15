import React, { Component, ComponentProps } from 'react'
import { Texture, Ticker, Rectangle } from 'pixi.js'
import { Animation } from './animation'
import { Sprite } from '@inlet/react-pixi'

type Props = ComponentProps<typeof Sprite> & {
  animation?: Animation
  pointerdown?: () => void
  onFinish?: () => void
}

type State = {
  currentFrame: number
}

export class AnimatedSprite extends Component<Props, State> {
  ticker!: Ticker
  tickerCallback!: () => void
  texture!: Texture
  startAnimation = (animation: Animation, { onFinish }: Props) => {
    const {
      texture,
      width,
      height,
      framesCount,
      frameGap,
      options: { loop, delay, endReversed },
    } = animation
    this.setState({
      currentFrame: -1,
    })
    this.texture = new Texture(texture)
    this.texture.frame = new Rectangle(0, 0, width, height)
    let skipped = 0
    let currentDelay = delay
    let direction = 1
    this.tickerCallback = () => {
      if (++skipped > frameGap) {
        if (--currentDelay > 0) {
          return
        }
        skipped = 0
        let frame = this.state.currentFrame + direction
        if (direction > 0 && frame >= framesCount - 1) {
          if (endReversed) {
            direction = -1
          } else if (!loop) {
            this.ticker.remove(this.tickerCallback)
            if (onFinish) {
              onFinish()
            }
            return
          }
          if (!endReversed) {
            currentDelay = delay
            frame = 0
          }
        } else if (direction < 0 && endReversed && frame <= 0) {
          if (!loop) {
            this.ticker.remove(this.tickerCallback)
            if (onFinish) {
              onFinish()
            }
            return
          }
          currentDelay = delay
          frame = 0
          direction = 1
        }

        this.texture.frame = new Rectangle(frame * width, 0, width, height)
        this.setState({
          currentFrame: frame,
        })
      }
    }
    this.ticker.add(this.tickerCallback)
  }
  UNSAFE_componentWillMount() {
    const { animation } = this.props
    this.ticker = new Ticker()
    if (animation) {
      this.startAnimation(animation, this.props)
      this.ticker.start()
    }
  }
  UNSAFE_componentWillReceiveProps(newProps: Props) {
    const { animation } = newProps
    if (animation && animation !== this.props.animation) {
      this.ticker.remove(this.tickerCallback)
      this.startAnimation(animation, newProps)
    }
  }
  componentWillUnmount() {
    this.ticker.destroy()
  }
  render() {
    // eslint-disable @typescript-eslint/no-unused-vars
    const { onFinish, animation, ...spriteProps } = this.props
    const texture = this.texture || this.props.texture
    if (!texture) {
      console.warn('No texture in animation!')
      return null
    }
    return <Sprite {...spriteProps} texture={texture} />
  }
}
