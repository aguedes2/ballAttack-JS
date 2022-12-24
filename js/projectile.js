import { CONTEXT as ctx } from './constatns.js'

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
    ctx.fill()
  }

  update() {
    this.move()
    this.draw(ctx)
  }

  move() {
    this.y -= this.velocity
  }
}

export default Projectile
