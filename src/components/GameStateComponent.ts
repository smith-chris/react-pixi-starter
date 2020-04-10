export class GameStateComponent {
  public lives: number = 2

  public level: number = 0

  public hits: number = 0

  public playing: boolean = false

  public setForStart(): void {
    this.lives = 1
    this.level = 0
    this.hits = 0
    this.playing = true
  }
}
