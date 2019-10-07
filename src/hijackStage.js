import { Sprite, BitmapText, Stage, AppProvider } from '@inlet/react-pixi'

Stage.componentDidMount = function() {
  const { onMount, width, height, options, raf } = this.props

  this.app = new Application({
    width,
    height,
    view: this._canvas,
    ...options,
  })

  this.app.ticker.autoStart = false

  this.app.ticker[raf ? 'start' : 'stop']()

  this.mountNode = PixiFiber.createContainer(this.app.stage)
  PixiFiber.updateContainer(this.getChildren(), this.mountNode, this)

  injectDevtools()

  onMount(this.app)
  this.renderStage()
}
