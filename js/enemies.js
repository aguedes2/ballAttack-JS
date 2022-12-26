import { CONTEXT as ctx, WIDTH, HEIGHT } from './constatns.js'

class Enemy {
  constructor(x, y, radius, type, color, velocity, dir) {
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
    this.life = 2
    this.setType(type)
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

  setType(type) {
    switch (type) {
      case 1:
        this.color = 'rgb(10, 50, 215)'
        this.radius = 25
        this.velocity = {
          x: Math.random() * 2,
          y: Math.random() * 2
        }
        break
      case 2:
        this.color = 'rgb(50, 215, 10)'
        this.radius = 22
        this.velocity = {
          x: Math.random() * 2,
          y: Math.random() * 2
        }
        break
      case 3:
        this.color = 'rgb(215, 50, 10)'
        this.radius = 20
        this.velocity = {
          x: Math.random() * 3,
          y: Math.random() * 3
        }
        break
      case 4:
        this.color = 'rgb(215, 150, 10)'
        this.radius = 18
        this.velocity = {
          x: Math.random() * 3,
          y: Math.random() * 3
        }
        break

      default:
        break
    }
  }

  bacameAnotherEnemy() {
    let newType
    if (this.type > 1) {
      newType = this.type - 1
    }
    return newType
  }
}

export default Enemy
