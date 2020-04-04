import { Engine, NodeList, System } from '@ash.ts/ash'
import { Viewport } from 'const/types'
import { GameNode, SpaceshipNode } from '../nodes'
import { createSpaceship } from 'entities/SpaceshipEntity'
import { designWidth, designHeight } from 'setup/dimensions'

export class ShipSpawnSystem extends System {
  private games: NodeList<GameNode> | null = null

  private spaceships: NodeList<SpaceshipNode> | null = null

  engine!: Engine

  public constructor(public viewport: Viewport) {
    super()
  }

  public addToEngine(engine: Engine): void {
    this.engine = engine
    this.games = engine.getNodeList(GameNode)
    this.spaceships = engine.getNodeList(SpaceshipNode)
  }

  public update(): void {
    const gameNode = this.games!.head
    if (!gameNode?.state.playing) {
      return
    }
    if (this.spaceships!.empty) {
      if (gameNode.state.lives > 0) {
        const newSpaceshipPositionX = designWidth / 2
        const newSpaceshipPositionY = designHeight / 2
        const spaceship = createSpaceship(
          newSpaceshipPositionX,
          newSpaceshipPositionY,
        )
        this.engine.addEntity(spaceship)
      } else {
        gameNode.state.playing = false
        gameNode.state.setForStart()
      }
    }
  }

  public removeFromEngine(): void {
    this.games = null
    this.spaceships = null
  }
}
