import { CONTEXT as ctx, WIDTH, HEIGHT } from './constatns.js'

class Enemy {
  constructor(x, y, radius, color, velocity, dir) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
    this.dir = {
      x: dir.x,
      y: dir.y
    }
    this.life = 20
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fill()
  }

  move() {
    this.draw()

    this.x += this.velocity.x * this.dir.x
    this.y += this.velocity.y * this.dir.y

    if (
      (this.dir.y > 0 && this.y + this.radius >= HEIGHT) ||
      (this.dir.y < 0 && this.y - this.radius <= 0)
    ) {
      this.dir.y *= -1
    }
    if (
      (this.dir.x > 0 && this.x + this.radius >= WIDTH) ||
      (this.dir.x < 0 && this.x - this.radius <= 0)
    ) {
      this.dir.x *= -1
    }
  }

  hit(projectile) {
    let dist = Math.hypot(projectile.x - this.x, projectile.y - this.y)
    if (dist - this.radius - projectile.radius < 1) {
      this.life--
      return true
    }
  }

  dead() {
    if (this.life <= 0) {
      return true
    }
  }
}

export default Enemy
