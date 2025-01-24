const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

// Game variables
let score = 0
let lives = 3
let level = 1
let gameLoopId
let isPaused = false

// Paddle
const paddle = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  width: 100,
  height: 10,
  dx: 5,
}

// Ball
const ball = {
  x: canvas.width / 2,
  y: paddle.y - 10,
  radius: 5,
  dx: 3,
  dy: -3,
  speed: 3,
}

// Bricks
const brickRowCount = 5
const brickColumnCount = 10
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30

let bricks = []

function initBricks() {
  bricks = []
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 }
    }
  }
}

// Draw paddle
function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height)
  ctx.fillStyle = "#0f0"
  ctx.fill()
  ctx.closePath()
}

// Draw ball
function drawBall() {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fillStyle = "#0f0"
  ctx.fill()
  ctx.closePath()
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = "#0f0"
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

// Move paddle
function movePaddle() {
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.dx
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.dx
  }
}

// Move ball
function moveBall() {
  ball.x += ball.dx
  ball.y += ball.dy

  // Bounce off walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy
  }

  // Bounce off paddle
  if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
    ball.dy = -ball.dy
    // Add some randomness to the ball direction
    ball.dx = 8 * ((ball.x - (paddle.x + paddle.width / 2)) / paddle.width)
  }

  // Game over
  if (ball.y + ball.radius > canvas.height) {
    lives--
    if (lives === 0) {
      gameOver()
    } else {
      resetBall()
    }
  }
}

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r]
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
          ball.dy = -ball.dy
          b.status = 0
          score++
          if (score % (brickRowCount * brickColumnCount) === 0) {
            if (lives > 0) {
              level++
              initBricks()
              resetBall()
              ball.speed += 0.5
              ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1)
              ball.dy = -ball.speed
            }
          }
        }
      }
    }
  }
}

// Reset ball
function resetBall() {
  ball.x = canvas.width / 2
  ball.y = paddle.y - 10
  ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1)
  ball.dy = -ball.speed
}

// Game loop
function gameLoop() {
  if (!isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks()
    drawPaddle()
    drawBall()
    movePaddle()
    moveBall()
    collisionDetection()

    document.getElementById("scoreValue").textContent = score
    document.getElementById("livesValue").textContent = lives

    ctx.fillStyle = "#0f0"
    ctx.font = "16px Courier"
    ctx.fillText(`Nivel: ${level}`, 8, 20)

    gameLoopId = requestAnimationFrame(gameLoop)
  }
}

// Game over
function gameOver() {
  cancelAnimationFrame(gameLoopId)
  ctx.font = "40px Courier"
  ctx.fillStyle = "#0f0"
  ctx.textAlign = "center"
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
}

// Event listeners
let rightPressed = false
let leftPressed = false

document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false
  }
}

// Start button
document.getElementById("startButton").addEventListener("click", () => {
  score = 0
  lives = 3
  level = 1
  ball.speed = 3
  initBricks()
  resetBall()
  isPaused = false
  gameLoop()
})

// Pause button
document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused
  if (!isPaused) {
    gameLoop()
  }
})

// Initial setup
initBricks()
drawBricks()
drawPaddle()
drawBall()

