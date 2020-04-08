import { Engine, NodeList, System } from '@ash.ts/ash'
import * as PIXI from 'pixi.js'
import Matter from 'matter-js'
import { MatterRender, MatterMouse } from 'utils/matter'

import { RenderNode } from 'nodes'
import { getSizeProps } from 'setup/getSizeProps'
import { Viewport } from 'const/types'
import { designWidth, designHeight, minHeight } from 'setup/dimensions'
import { debug } from 'const/debug'
import midflap from 'assets/sprites/yellowbird-midflap.png'
import { BodyRenderNode } from 'nodes/BodyRenderNode'

interface RenderSystemOptions {
  emitStageEvents: boolean
}

export class RenderSystem extends System {
  private renderNodes: NodeList<RenderNode> | null = null
  private bodyNodes: NodeList<BodyRenderNode> | null = null

  private readonly renderer: PIXI.Renderer
  private readonly physics: Matter.Engine

  private readonly stage: PIXI.Container

  private readonly view: HTMLCanvasElement

  private container: HTMLElement

  private options: RenderSystemOptions

  public constructor(
    container: HTMLElement,
    viewport: Viewport,
    options: RenderSystemOptions = { emitStageEvents: true },
  ) {
    super()

    this.container = container
    this.options = options

    // Setup pixi
    const app = new PIXI.Application({
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: 0x64b5f6,
    })

    this.renderer = app.renderer
    this.stage = app.stage
    this.view = app.view

    const canvas = app.view
    const { renderer, stage } = app

    if (debug) {
      const graphics = new PIXI.Graphics()

      graphics.lineStyle(2, 0xf44336, 1)
      graphics.drawRect(0, 0, designWidth, designHeight)
      graphics.lineStyle(2, 0xffeb3b, 1)
      graphics.drawRect(
        0,
        (designHeight - minHeight) / 2,
        designWidth,
        minHeight,
      )
      graphics.endFill()

      stage.addChild(graphics)
    }

    // Setup matter
    const physics = Matter.Engine.create()
    this.physics = physics
    const Bodies = Matter.Bodies
    const wallTop = Bodies.rectangle(designWidth / 2, 0, designWidth, 10, {
      isStatic: true,
    })
    const wallBottom = Bodies.rectangle(
      designWidth / 2,
      designHeight,
      designWidth,
      10,
      {
        isStatic: true,
      },
    )
    const wallRight = Bodies.rectangle(
      designWidth,
      designHeight / 2,
      10,
      designHeight,
      {
        isStatic: true,
      },
    )
    const wallLeft = Bodies.rectangle(0, designHeight / 2, 10, designHeight, {
      isStatic: true,
    })
    const startY = designHeight * 0.5
    const startX = designWidth * 0.28
    // const birdBody = Matter.Bodies.rectangle(
    //   startX,
    //   startY,
    //   midflap.width,
    //   midflap.height,
    //   {
    //     restitution: 0.8,
    //     isStatic: true,
    //   },
    // )

    // const partA = Bodies.rectangle(20, 200, 120, 50)
    // const partB = Bodies.rectangle(60, 200, 50, 190),
    // compound = Matter.Body.create({
    //   parts: [partA, partB],
    //   isStatic: true,
    // })
    Matter.World.add(physics.world, [
      // birdBody,
      wallBottom,
      wallTop,
      wallLeft,
      wallRight,
      // compound,
    ])
    // const imageSprite = PIXI.Sprite.from(midflap.src)
    // imageSprite.width = midflap.width
    // imageSprite.height = midflap.height
    // imageSprite.anchor.set(0.5, 0.5)
    // app.stage.addChild(imageSprite)

    let timePassed = 0

    const getVariation = (timePassed: number) =>
      Math.sin(timePassed / 7 / (1000 / 60))

    const getY = (timePassed: number) =>
      startY - Math.round(getVariation(timePassed) * 5)

    // app.ticker.add(delta => {
    //   timePassed += delta * (1000 / 60)
    //   const newPosition = { x: birdBody.position.x, y: getY(timePassed) }
    //   Matter.Body.setPosition(birdBody, newPosition)
    //   imageSprite.position.x = birdBody.position.x
    //   imageSprite.position.y = birdBody.position.y
    //   imageSprite.rotation = birdBody.angle
    // })
    Matter.Engine.run(physics)
    const matterContainer = document.getElementById('matter')
    if (!matterContainer) {
      console.warn(`Can't find matter container!`)
      return
    }
    const render = MatterRender.create({
      element: matterContainer,
      engine: physics,
    })

    const matterMouse = MatterMouse.create(render.canvas)

    const mouseConstraint = Matter.MouseConstraint.create(physics, {
      mouse: matterMouse,
    })

    Matter.World.add(physics.world, mouseConstraint)
    MatterRender.run(render)

    const onResize = () => {
      const sizeProps = getSizeProps({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      const { width, height } = sizeProps.renderer
      const stageTop = sizeProps.stage.position.y
      const stageScale = sizeProps.stage.scale.x
      const extraHeight = Math.round(stageTop / stageScale)
      const bottom = designHeight + extraHeight
      const top = -extraHeight

      // Transform pixi
      Object.assign(stage, sizeProps.stage)
      renderer.resize(width, height)
      canvas.style.width = `${sizeProps.canvas.width}px`
      canvas.style.height = `${sizeProps.canvas.height}px`

      // Transform matter
      render.canvas.style.width = `${sizeProps.canvas.width}px`
      render.canvas.style.height = `${sizeProps.canvas.height}px`
      render.canvas.width = sizeProps.viewport.width
      render.canvas.height = sizeProps.viewport.height
      // @ts-ignore
      render.options.offset.y = extraHeight
      matterMouse.offset.y = -stageTop / stageScale

      // Setup viewport variables
      viewport.width = sizeProps.viewport.width
      viewport.height = sizeProps.viewport.height
      viewport.top = top
      viewport.bottom = bottom
    }
    onResize()
    window.addEventListener('resize', onResize)
  }

  public addToEngine(engine: Engine): void {
    this.container.appendChild(this.view)
    this.renderNodes = engine.getNodeList(RenderNode)
    for (
      let node: RenderNode | null = this.renderNodes.head;
      node;
      node = node.next
    ) {
      this.addToStage(node)
    }
    this.renderNodes.nodeAdded.add(this.addToStage)
    this.renderNodes.nodeRemoved.add(this.removeFromStage)
    // Bodies
    this.bodyNodes = engine.getNodeList(BodyRenderNode)
    for (
      let node: BodyRenderNode | null = this.bodyNodes.head;
      node;
      node = node.next
    ) {
      this.addBody(node)
    }
  }

  private addToStage = (node: RenderNode) => {
    this.stage.addChild(node.display.object)
    if (this.options.emitStageEvents) {
      node.display.object.emit('addedToStage')
    }
  }
  private addBody = (node: BodyRenderNode) => {
    this.stage.addChild(node.display.object)
    if (this.options.emitStageEvents) {
      node.display.object.emit('addedToStage')
    }
    Matter.World.add(this.physics.world, node.body.body)
  }

  private removeFromStage = (node: RenderNode) => {
    this.stage.removeChild(node.display.object)
    if (this.options.emitStageEvents) {
      node.display.object.emit('removedFromStage')
    }
  }

  public update(): void {
    for (let node = this.renderNodes!.head; node; node = node.next) {
      const { display, transform } = node
      display.object.setTransform(
        transform.x,
        transform.y,
        1,
        1,
        transform.rotation,
      )
    }
    // Bodies
    for (let node = this.bodyNodes!.head; node; node = node.next) {
      const {
        display,
        body: { body },
      } = node
      display.object.setTransform(
        body.position.x,
        body.position.y,
        1,
        1,
        body.angle,
      )
    }
    this.renderer.render(this.stage)
  }

  public removeFromEngine(): void {
    this.container.removeChild(this.view)
    this.renderNodes = null
  }
}
