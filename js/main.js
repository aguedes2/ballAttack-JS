import Audios from './audios.js'
import Player from './player.js'
import Projectile from './projectile.js'
import Particle from './particle.js'
import Enemy from './enemies.js'
import Score from './score.js'

import { CANVAS, CONTEXT, WIDTH, HEIGHT } from './constatns.js'

const starGameBtn = document.querySelector('#start-game-El')
const gameModal = document.querySelector('#modalEl')
const gameOverScore = document.querySelector('#end-score')

//sons
const music = new Audios('theblackframe.mp3')
const game_over = new Audios('game_over.wav')
const shot = new Audios('impact_laser.mp3')
const explosion = new Audios('hard_impact_alarm.mp3')
const player_hit = new Audios('arcade_action.wav')
const enemy_hit = new Audios('dropped.mp3')

CANVAS.width = WIDTH
CANVAS.height = HEIGHT
const center_x = WIDTH / 2

var level = 1

//Entities
var player = new Player(center_x - 5, HEIGHT - 20, 10)
var enemies = []
var projectiles = []
var particles = []

var status = ''
var points = 0
var score = new Score(points)

function init() {
  if (status == 'Playing') {
    enemies = []
    particles = []
    projectiles = []
    points = 0
    player = new Player(center_x - 5, HEIGHT - 20, 10)
    spawnEnemies(enemies)
    music.play()
    gameModal.style.display = 'none'
    animate()
  }
}

starGameBtn.addEventListener('click', () => {
  status = 'Playing'
  init()
})

//player
addEventListener('mousemove', (e) => {
  if (status === 'Playing') player.move(e)
})

function playerLost() {
  if (player.isLost()) {
    cancelAnimationFrame(animationID)
    status = 'Game Over'
    level = 1
    music.stop()
    game_over.play()
    player.life = 2
    gameOverScore.innerHTML = points
    gameModal.style.display = 'flex'
    game_over.currentTime = 0
  }
}
//end player

//enemies
function spawnEnemies(array) {
  let stage = level
  let type
  let secondType
  let qtdEnemies
  switch (stage) {
    case 1:
      type = 1
      qtdEnemies = 5
      break
    case 2:
      type = 2
      qtdEnemies = 7
      break
    case 3:
      type = 3
      qtdEnemies = 9
      break
    case 4:
      type = 4
      qtdEnemies = 8
      break
    case 5:
      type = 1
      secondType = 2
      qtdEnemies = 5
      break
    case 6:
      type = 2
      secondType = 3
      qtdEnemies = 8
      break
    case 7:
      type = 3
      secondType = 4
      qtdEnemies = 8
      break
    case 8:
      type = 1
      secondType = 3
      qtdEnemies = 10
      break

    default:
      break
  }

  for (let i = 0; i < qtdEnemies; i++) {
    let x = Math.random() * ((WIDTH * 3) / 4)
    let y = 100
    let radius = 20
    let color = `hsl(${Math.random() * 360}, 50%, 35%)`
    let velocity = { x: Math.random() * 3, y: Math.random() * 3 }

    let dir = {
      x: Math.random() < 0.5 ? -1 : 1,
      y: Math.random() < 0.5 ? -1 : 1
    }
    let enemy1 = new Enemy(x, y, radius, type, color, velocity, dir)
    enemy1.setType(type)
    array.push(enemy1)
    if (level > 4) {
      let enemy2 = new Enemy(x, y, radius, secondType, color, velocity, dir)
      enemy2.setType(secondType)
      array.push(enemy2)
    }
  }
}
//end enemies

//projectiles
addEventListener('click', (e) => {
  shot.currentTime = 0
  if (status === 'Playing') {
    projectiles.push(new Projectile(player.x, player.y, 5, 'red', 5))
    shot.play()
  }
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
  player_hit.currentTime = 0
  explosion.currentTime = 0
  explosion.volume = 0.3
  enemies.forEach((enemy, index) => {
    enemy.move()

    let dist = Math.hypot(enemy.x - player.x, enemy.y - player.y)
    if (dist - enemy.radius - player.radius < 1) {
      player_hit.play()
      setTimeout(player.hit(), 3)
    }
    if (enemy.dead()) {
      enemies.splice(index, 1)
      points += 250
      explosion.play()
      if (enemies.length == 0) {
        setTimeout(nextLevel(), 3000)
      }
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
      enemy_hit.currentTime = 0
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

          enemy_hit.play()
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 5,
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
      explosion.currentTime = 0
      if (enemy.life > 0 && enemy.type > 1) {
        console.log(enemy.type)
        let newType = enemy.bacameAnotherEnemy()
        let radius = enemy.radius
        let color = enemy.color
        for (let index = 0; index < 2; index++) {
          enemies.push(
            new Enemy(
              enemy.x,
              enemy.y,
              radius,
              newType,
              color,
              { x: enemy.velocity.x, y: enemy.velocity.y },
              {
                x: Math.random() > 0.5 ? 1 : -1,
                y: Math.random() > 0.5 ? 1 : -1
              }
            )
          )
        }
      } else {
        explosion.play()
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
}

addEventListener('keydown', (e) => {
  if (e.key === '+') {
    music.turnUp()
  } else if (e.key === '-') {
    music.turnDown()
  }
})

function nextLevel() {
  if (level < 9 && enemies.length == 0) {
    status = 'Novo Level'
    music.stop()
    level++
    console.log(level)

    status = 'Playing'
    setTimeout(init(), 1500)
  }
}
