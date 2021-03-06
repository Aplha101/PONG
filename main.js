const area = document.getElementById('canvas')
const html = document.getElementById('html')

const p1 = document.getElementById('p1')
const p2 = document.getElementById("p2")

const p1up = document.getElementById('p1up')
const p1down = document.getElementById('p1down')

const p2up = document.getElementById('p2up')
const p2down = document.getElementById("p2down")

let ctx = area.getContext('2d')

area.style = "background:#556479;"


area.height = html.getBoundingClientRect().width / 2
area.width = html.getBoundingClientRect().width

if (window.innerHeight < window.innerWidth) {
  area.width = html.getBoundingClientRect().height
  area.height = html.getBoundingClientRect().height / 2
}

let playerOneScore = 0
let playerTwoScore = 0

function dist(x, y, posx, posy) {
  return Math.sqrt(Math.pow(x - posx, 2) + Math.pow(y - posy, 2))
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

class paddle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.ysp = 0
  }
  draw() {
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.rect(this.x, this.y, 10, 80)
    ctx.fill()
  }
  update() {
    this.y += this.ysp
  }
  limit(){
    this.y = clamp(this.y , 0 , area.height - 80)
  }
  move(up , down){
    up.addEventListener("click" , (e) => {
    if(e.isTrusted === true){
      this.ysp = -1
    }
    })
    down.addEventListener("click" , (e) => {
      if(e.isTrusted===true){
        this.ysp = 1
      }
    })
  }
}

class ball {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.xsp = 1
    this.ysp = -1
  }
  draw() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
    ctx.fill()
  }
  update() {
    this.x += this.xsp
    this.y += this.ysp
  }
  bounce() {
    if (this.y + this.ysp > area.height || this.y + this.ysp < 0) {
      this.ysp *= -1
    }
  }
  paddleBounce(a, b) {
    let distX = Math.abs(this.x - a.x - 10 / 2);
    let distY = Math.abs(this.y - a.y - 80 / 2);
    let A = Math.abs(this.x - b.x - 10 / 2);
    let B = Math.abs(this.y - b.y - 80 / 2);
    if (distX <= 10 / 2 && distY <= 80 / 2 || A <= 10 / 2 && B <= 80 / 2) {
      this.xsp *= -1
    }
  }
  restart() {
    if (this.x + this.xsp > area.width || this.x + this.xsp < 0) {
      if (this.xsp == -1) {
        playerTwoScore += 1
      } else {
        playerOneScore += 1
      }
      p1.textContent = playerOneScore
      p2.textContent = playerTwoScore
      this.x = area.width / 2
      this.y = area.height / 2
    }
  }
  cornerCollision(a, b) {
    let distX = Math.abs(this.x - a.x - 10 / 2);
    let distY = Math.abs(this.y - a.y - 80 / 2);
    let A = Math.abs(this.x - b.x - 10 / 2);
    let B = Math.abs(this.y - b.y - 80 / 2);
    var dx = distX - 10 / 2;
    var dy = distY - 80 / 2;
    return (dx * dx + dy * dy <= (10 * 10));
  }
}

let Ball = new ball(area.width / 2, area.height / 2, "#fff")

let Player1 = new paddle(20, (area.height / 2) -40 ) 
let Player2 = new paddle(area.width - 20, (area.height / 2) - 40)

function clearAll() {
  ctx.clearRect(0, 0, area.width, area.height)
}


setInterval(() => {
  clearAll()
  Ball.update()
  Ball.draw()
  Ball.bounce()
  Ball.restart()
  Ball.paddleBounce(Player1, Player2)

  if (Ball.cornerCollision(Player1, Player2)) {
    Ball.xsp *= -1
  }
  Player1.update()
  Player1.draw()
  Player1.limit()
  Player1.move(p1up, p1down)
  
  Player2.limit()
  Player2.move(p2up , p2down)
  Player2.update()
  Player2.draw()
})
