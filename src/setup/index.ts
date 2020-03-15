import { Engine, Actor, Color, CollisionType } from 'excalibur/engine'

const game = new Engine({
  width: 800,
  height: 600,
  canvasElement: document.getElementById('canvas') as HTMLCanvasElement,
})

// Create an actor with x position of 150px,
// y position of 40px from the bottom of the screen,
// width of 200px, height and a height of 20px
const paddle = new Actor(150, game.drawHeight - 40, 200, 20)

// Let's give it some color with one of the predefined
// color constants
paddle.color = Color.Chartreuse

// Make sure the paddle can partipate in collisions, by default excalibur actors do not collide
// paddle.collisionType = CollisionType.Fixed

// `game.add` is the same as calling
// `game.currentScene.add`
game.add(paddle)

game.start()
