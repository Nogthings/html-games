// Variables del juego
let score = 0
let level = 1
let isGameRunning = false

// Elementos del DOM
const startButton = document.getElementById("startButton")
const pauseButton = document.getElementById("pauseButton")
const resetButton = document.getElementById("resetButton")
const scoreValue = document.getElementById("scoreValue")
const levelValue = document.getElementById("levelValue")
const gameCharacter = document.querySelector(".game-character")

// Funciones del juego
function startGame() {
  if (!isGameRunning) {
    isGameRunning = true
    gameLoop()
  }
}

function pauseGame() {
  isGameRunning = false
}

function resetGame() {
  score = 0
  level = 1
  updateUI()
  isGameRunning = false
  gameCharacter.style.left = "50%"
}

function updateUI() {
  scoreValue.textContent = score
  levelValue.textContent = level
}

function gameLoop() {
  if (!isGameRunning) return

  // Lógica del juego aquí
  score += 10
  if (score % 100 === 0) {
    level++
  }

  updateUI()

  // Mover el personaje
  const currentLeft = Number.parseFloat(getComputedStyle(gameCharacter).left)
  gameCharacter.style.left = `${(currentLeft + 5) % 780}px`

  requestAnimationFrame(gameLoop)
}

// Event listeners
startButton.addEventListener("click", startGame)
pauseButton.addEventListener("click", pauseGame)
resetButton.addEventListener("click", resetGame)

// Inicializar UI
updateUI()

