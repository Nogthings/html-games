const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

const CELL_SIZE = 20
const PACMAN_SIZE = 16
const GHOST_SIZE = 16
const GRID_WIDTH = 28
const GRID_HEIGHT = 31

let score = 0
let lives = 3
const level = 1
let gameLoopId // Update 1: Changed gameLoop to gameLoopId
let isPaused = false

const pacman = {
  x: 13,
  y: 23,
  direction: 0,
  nextDirection: 0,
}

const ghosts = [
  { x: 13, y: 11, color: "#FF0000", direction: 0 }, // Red (Blinky)
  { x: 14, y: 11, color: "#00FFFF", direction: 0 }, // Cyan (Inky)
  { x: 13, y: 13, color: "#FFB8FF", direction: 0 }, // Pink (Pinky)
  { x: 14, y: 13, color: "#FFB852", direction: 0 }, // Orange (Clyde)
]

const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 3, 3, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

function drawMaze() {
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "#0000FF"
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      } else if (maze[y][x] === 0) {
        ctx.fillStyle = "#FFFF00"
        ctx.beginPath()
        ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (maze[y][x] === 2) {
        ctx.fillStyle = "#FFFF00"
        ctx.beginPath()
        ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

function drawPacman() {
  ctx.fillStyle = "#FFFF00"
  ctx.beginPath()
  const mouthAngle = 0.2 * Math.PI * Math.sin(Date.now() / 100)
  ctx.arc(
    pacman.x * CELL_SIZE + CELL_SIZE / 2,
    pacman.y * CELL_SIZE + CELL_SIZE / 2,
    PACMAN_SIZE / 2,
    (pacman.direction * Math.PI) / 2 + mouthAngle,
    (pacman.direction * Math.PI) / 2 + (2 * Math.PI - mouthAngle),
  )
  ctx.lineTo(pacman.x * CELL_SIZE + CELL_SIZE / 2, pacman.y * CELL_SIZE + CELL_SIZE / 2)
  ctx.fill()
}

function drawGhosts() {
  ghosts.forEach((ghost) => {
    ctx.fillStyle = ghost.color
    ctx.beginPath()
    ctx.arc(ghost.x * CELL_SIZE + CELL_SIZE / 2, ghost.y * CELL_SIZE + CELL_SIZE / 2, GHOST_SIZE / 2, Math.PI, 0)
    ctx.lineTo(ghost.x * CELL_SIZE + CELL_SIZE / 2, ghost.y * CELL_SIZE + CELL_SIZE)
    ctx.lineTo(ghost.x * CELL_SIZE, ghost.y * CELL_SIZE + CELL_SIZE)
    ctx.fill()
  })
}

function updatePacman() {
  if (canMove(pacman.x, pacman.y, pacman.nextDirection)) {
    pacman.direction = pacman.nextDirection
  }

  if (canMove(pacman.x, pacman.y, pacman.direction)) {
    switch (pacman.direction) {
      case 0:
        pacman.x++
        break
      case 1:
        pacman.y--
        break
      case 2:
        pacman.x--
        break
      case 3:
        pacman.y++
        break
    }
  }

  if (maze[pacman.y][pacman.x] === 0 || maze[pacman.y][pacman.x] === 2) {
    score += maze[pacman.y][pacman.x] === 2 ? 10 : 1
    maze[pacman.y][pacman.x] = 3
  }
}

function updateGhosts() {
  ghosts.forEach((ghost) => {
    const directions = getPossibleDirections(ghost.x, ghost.y)
    if (directions.length > 0) {
      ghost.direction = directions[Math.floor(Math.random() * directions.length)]
    }

    switch (ghost.direction) {
      case 0:
        ghost.x++
        break
      case 1:
        ghost.y--
        break
      case 2:
        ghost.x--
        break
      case 3:
        ghost.y++
        break
    }

    if (ghost.x === pacman.x && ghost.y === pacman.y) {
      lives--
      if (lives === 0) {
        gameOver()
      } else {
        resetPositions()
      }
    }
  })
}

function canMove(x, y, direction) {
  switch (direction) {
    case 0:
      return maze[y][x + 1] !== 1
    case 1:
      return maze[y - 1][x] !== 1
    case 2:
      return maze[y][x - 1] !== 1
    case 3:
      return maze[y + 1][x] !== 1
  }
}

function getPossibleDirections(x, y) {
  const directions = []
  if (canMove(x, y, 0)) directions.push(0)
  if (canMove(x, y, 1)) directions.push(1)
  if (canMove(x, y, 2)) directions.push(2)
  if (canMove(x, y, 3)) directions.push(3)
  return directions
}

function resetPositions() {
  pacman.x = 13
  pacman.y = 23
  pacman.direction = 0
  pacman.nextDirection = 0

  ghosts[0].x = 13
  ghosts[0].y = 11
  ghosts[1].x = 14
  ghosts[1].y = 11
  ghosts[2].x = 13
  ghosts[2].y = 13
  ghosts[3].x = 14
  ghosts[3].y = 13
}

function runGameLoop() {
  // Update 2: Renamed gameLoop to runGameLoop
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawMaze()
  updatePacman()
  updateGhosts()
  drawPacman()
  drawGhosts()

  document.getElementById("scoreValue").textContent = score
  document.getElementById("livesValue").textContent = lives

  if (!isPaused) {
    gameLoopId = requestAnimationFrame(runGameLoop) // Update 2:  Reference updated
  }
}

function gameOver() {
  cancelAnimationFrame(gameLoopId) // Update 3: Reference updated
  ctx.fillStyle = "#FFFF00"
  ctx.font = "40px Courier"
  ctx.textAlign = "center"
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      pacman.nextDirection = 0
      break
    case "ArrowUp":
      pacman.nextDirection = 1
      break
    case "ArrowLeft":
      pacman.nextDirection = 2
      break
    case "ArrowDown":
      pacman.nextDirection = 3
      break
  }
})

document.getElementById("startButton").addEventListener("click", () => {
  score = 0
  lives = 3
  resetPositions()
  isPaused = false
  runGameLoop() // Update 3: Reference updated
})

document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused
  if (!isPaused) {
    runGameLoop() // Update 3: Reference updated
  }
})

// Initial setup
drawMaze()
drawPacman()
drawGhosts()

