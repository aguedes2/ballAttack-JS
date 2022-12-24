import { CONTEXT as ctx } from './constatns.js'
const scoreEl = document.querySelector('#scoreEl')

class Score {
  // constructor(x, y, text, color) {
  //   this.x = x
  //   this.y = y
  //   this.text = text
  //   this.color = color
  // }

  constructor(text) {
    this.text = text
  }

  draw() {
    scoreEl.innerHTML = this.text
    //   ctx.fillStyle = 'rgba(250, 250, 250, 0.8)'
    //   ctx.font = '40px cursive'
    //   ctx.fillText(this.text, this.x, this.y)
  }

  update(points) {
    this.draw()
    this.text = points
  }
}

export default Score
