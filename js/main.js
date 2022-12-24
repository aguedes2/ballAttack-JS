import Player from './player.js'
import Projectile from './projectile.js'
import Particle from './particle.js'
import Enemy from './enemies.js'
import Score from './score.js'
import { CANVAS, CONTEXT, WIDTH, HEIGHT } from './constatns.js'

const starGameBtn = document.querySelector('#start-game-El')
const gameModal = document.querySelector('#modalEl')
const gameOverScore = document.querySelector('#end-score')

CANVAS.width = WIDTH
CANVAS.height = HEIGHT

//Entities
const center_x = WIDTH / 2
const player = new Player(center_x - 5, HEIGHT - 20, 10)

const projectiles = []
var qtdEnemies = 5
const enemies = []
const particles = []
var status = ''
var points = 0
var score = new Score(points)

//player
addEventListener('mousemove', (e) => {
  if (status === 'Playing') {
    player.move(e)
  }
})

function playerLost() {
  if (player.isLost()) {
    status = 'Game Over'
    cancelAnimationFrame(animationID)
    gameOverScore.innerHTML = points
    gameModal.style.display = 'flex'
  }
}
//end player

//enemies
function spawnEnemies(array) {
  for (let i = 0; i < qtdEnemies; i++) {
    let x = Math.random() * ((WIDTH * 3) / 4)
    let y = 100
    let radius = 20
    let color = `hsl(${Math.random() * 360}, 50%, 35%)`
    let velocity = { x: Math.random() * 5, y: Math.random() * 5 }

    let dir = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1
    }
    array.push(new Enemy(x, y, radius, color, velocity, dir))
  }
}
//end enemies

//projectiles
addEventListener('click', (e) => {
  projectiles.push(new Projectile(player.x, player.y, 5, 'red', 5))
})

function destroyProjectile(index) {
  projectiles.splice(index, 1)
}
//end projectiles

//particles
function spawnParticles() {
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })
}

//end particles

//interactions
function enemyPlayerInteractions() {
  enemies.forEach((enemy, index) => {
    enemy.move()

    let dist = Math.hypot(enemy.x - player.x, enemy.y - player.y)
    if (dist - enemy.radius - player.radius < 1) setTimeout(player.hit(), 3)
    if (enemy.dead()) {
      enemies.splice(index, 1)
      points += 250
    }
  })
}

function particleInteraction() {
  projectiles.forEach((projectile, index) => {
    projectile.update()

    if (projectile.y < 0) {
      destroyProjectile(index)
    }

    enemies.forEach((enemy) => {
      if (enemy.hit(projectile)) {
        destroyProjectile(index)
        becameOtherEnemy(enemy)
        points += 100
        for (let index = 0; index < enemy.radius * 0.5; index++) {
          var dirX =
            enemy.dir.x > 0
              ? 2 * (Math.random() - 0.7)
              : (Math.random() - 0.7) * -2
          var dirY =
            enemy.dir.y > 0
              ? 2 * (Math.random() - 0.7)
              : (Math.random() - 0.7) * -2

          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 3,
              enemy.color,
              {
                x: dirX,
                y: dirY
              }
            )
          )
          score.update(points)
        }
      }
    })

    function becameOtherEnemy(enemy) {
      if (enemy.radius > 10) {
        let radius = enemy.radius / 2
        let color = `hsl(${Math.random() * 360}, 50%, 50%)`
        for (let index = 0; index < 2; index++) {
          enemies.push(
            new Enemy(
              enemy.x,
              enemy.y,
              radius,
              color,
              { x: Math.random() * 4, y: Math.random() * 4 },
              {
                x: Math.random() > 0.5 ? 1 : -1,
                y: Math.random() > 0.5 ? 1 : -1
              }
            )
          )
        }
      } else {
        enemy.life = 0
      }
    }
  })
}
// end interaction

//Game methods
let animationID
function animate() {
  animationID = requestAnimationFrame(animate)
  CONTEXT.fillStyle = 'rgba(0,0,0,0.1)'
  CONTEXT.fillRect(0, 0, WIDTH, HEIGHT)

  player.draw()
  playerLost()
  enemyPlayerInteractions()
  particleInteraction()
  spawnParticles()

  // console.log(typeof gameModal.style.display)
}

starGameBtn.addEventListener('click', () => {
  status = 'Playing'
  animate()
  spawnEnemies(enemies)
  gameModal.style.display = 'none'
})