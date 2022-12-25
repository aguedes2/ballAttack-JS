import { CONTEXT as ctx, WIDTH } from './constatns.js'

var frames = 0
var show = true
var blink = false
class Player {
  constructor(x, y, radius) {
    this.life = 2
    this.x = x
    this.y = y
    this.radius = radius
    this.isHitting = false
    this.alpha = 1
  }

  init() {
    this.x = window.innerWidth / 2 - 5
    this.y = window.innerHeight - 20
    this.life = 2
    this.isHitting = false
    this.alpha = 1
  }

  draw() {
    this.drawLife()
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`

    if (show) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
      ctx.fill()
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)'
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.fill()
    }
  }

  //draw life
  drawLife() {
    ctx.fillStyle = 'rgb(220,220,220)'
    for (let i = 0; i <= this.life; i++) {
      ctx.beginPath()
      ctx.arc(30 + 30 * i, 50, 10, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.strokeStyle = 'rgba(250, 250, 250, 0.9)'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.fill()
    }
  }

  update() {}

  move(e) {
    if (!this.isLost()) {
      let root = document.documentElement
      let mouseX = e.clientX - root.scrollLeft
      let mouseY = e.clientY - root.scrollTop

      this.x = mouseX - this.radius
      this.y = mouseY - this.radius
    }
    this.draw(ctx)
  }

  hit() {
    this.isHitting = true
    this.damage()
  }

  damage() {
    if (this.isHitting && this.alpha === 1 && show && !this.isLost()) {
      blink = true
      show = false
      this.life--
      console.log('life: ', this.life)
      this.isHitting = false
      this.alpha = 0
    } else {
      setInterval(() => this.piscar(), 500)
      setTimeout(() => {
        this.alpha = 1
        show = true
        blink = false
      }, 2000)
    }
  }

  piscar() {
    if (blink && !this.isLost()) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(175, 69, 89, 1)`
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      ctx.fill()

      ctx.strokeStyle = 'rgba(160, 50, 70, 0.5)'
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.fill()
    }
  }

  isLost() {
    if (this.life < 0) {
      return true
    }
  }
}

export default Player
