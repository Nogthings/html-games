const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

let score = 0
let level = 1
let lives = 3
let asteroids = []
let bullets = []
let isPaused = false
let animationId;

const ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  angle: 0,
  rotation: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
}

function drawShip() {
  ctx.strokeStyle = "#0f0"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(
    ship.x + (4 / 3) * ship.radius * Math.cos(ship.angle),
    ship.y - (4 / 3) * ship.radius * Math.sin(ship.angle),
  )
  ctx.lineTo(
    ship.x - ship.radius * ((2 / 3) * Math.cos(ship.angle) + Math.sin(ship.angle)),
    ship.y + ship.radius * ((2 / 3) * Math.sin(ship.angle) - Math.cos(ship.angle)),
  )
  ctx.lineTo(
    ship.x - ship.radius * ((2 / 3) * Math.cos(ship.angle) - Math.sin(ship.angle)),
    ship.y + ship.radius * ((2 / 3) * Math.sin(ship.angle) + Math.cos(ship.angle)),
  )
  ctx.closePath()
  ctx.stroke()
}

function drawAsteroids() {
  ctx.strokeStyle = "#0f0";
  ctx.lineWidth = 2;

  asteroids.forEach((asteroid) => {
    ctx.beginPath();
    for (let i = 0; i < asteroid.vertices; i++) {
      const angle = (Math.PI * 2 * i) / asteroid.vertices + asteroid.angle;
      const radius = asteroid.radius * asteroid.offset[i];
      const x = asteroid.x + radius * Math.cos(angle);
      const y = asteroid.y + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  });
}


function drawBullets() {
  ctx.fillStyle = "#0f0"
  bullets.forEach((bullet) => {
    ctx.beginPath()
    ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2, false)
    ctx.fill()
  })
}

function updateShip() {
  ship.angle += ship.rotation

  if (ship.thrusting) {
    ship.thrust.x += 0.1 * Math.cos(ship.angle)
    ship.thrust.y -= 0.1 * Math.sin(ship.angle)
  } else {
    ship.thrust.x *= 0.99
    ship.thrust.y *= 0.99
  }

  ship.x += ship.thrust.x
  ship.y += ship.thrust.y

  // Wrap the ship around the screen
  if (ship.x < 0) ship.x = canvas.width
  if (ship.x > canvas.width) ship.x = 0
  if (ship.y < 0) ship.y = canvas.height
  if (ship.y > canvas.height) ship.y = 0
}

function updateAsteroids() {
  asteroids.forEach((asteroid) => {
    asteroid.x += asteroid.xv
    asteroid.y += asteroid.yv

    // Wrap asteroids around the screen
    if (asteroid.x < 0 - asteroid.radius) asteroid.x = canvas.width + asteroid.radius
    if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = 0 - asteroid.radius
    if (asteroid.y < 0 - asteroid.radius) asteroid.y = canvas.height + asteroid.radius
    if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = 0 - asteroid.radius
  })
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += bullets[i].xv
    bullets[i].y += bullets[i].yv

    // Remove bullets that are off screen
    if (bullets[i].x < 0 || bullets[i].x > canvas.width || bullets[i].y < 0 || bullets[i].y > canvas.height) {
      bullets.splice(i, 1)
    }
  }
}

function checkCollisions() {
  asteroids.forEach((asteroid, i) => {
    if (distBetweenPoints(ship.x, ship.y, asteroid.x, asteroid.y) < ship.radius + asteroid.radius) {
      lives--;
      if (lives === 0) {
        gameOver();
      } else {
        resetShip();
      }
    }

    bullets.forEach((bullet, j) => {
      if (distBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) < asteroid.radius) {
        // Otorga puntos según el tamaño del asteroide
        score += (6 - asteroid.sizeLevel) * 10;

        // Divide el asteroide en más pequeños si aplica
        splitAsteroid(asteroid);

        // Elimina el asteroide y el disparo
        asteroids.splice(i, 1);
        bullets.splice(j, 1);

        // Incrementa el nivel si no hay más asteroides
        if (asteroids.length === 0) {
          level++;
          createAsteroids(level + 2); // Más asteroides en niveles más altos
        }
      }
    });
  });
}

function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function resetShip() {
  ship.x = canvas.width / 2
  ship.y = canvas.height / 2
  ship.thrust.x = 0
  ship.thrust.y = 0
}

function createAsteroid(sizeLevel, x, y) {
  const size = sizeLevel * 10 + 20; // Tamaño base por nivel
  return {
    x: x ?? Math.random() * canvas.width,
    y: y ?? Math.random() * canvas.height,
    xv: (Math.random() * 2 - 1) * (6 - sizeLevel), // Velocidad inversamente proporcional al tamaño
    yv: (Math.random() * 2 - 1) * (6 - sizeLevel),
    radius: size,
    sizeLevel: sizeLevel, // Nivel del tamaño
    angle: Math.random() * Math.PI * 2, // Rotación inicial
    vertices: Math.floor(Math.random() * 5 + 5), // Número de vértices
    offset: Array.from({ length: Math.floor(Math.random() * 5 + 5) }, () => Math.random() * 0.4 + 0.8), // Irregularidad
  };
}

function createAsteroids(num) {
  for (let i = 0; i < num; i++) {
    const sizeLevel = Math.min(level, 5); // Tamaño máximo según el nivel
    asteroids.push(createAsteroid(sizeLevel));
  }
}

function splitAsteroid(asteroid) {
  if (asteroid.sizeLevel > 1) {
    const smallerSize = asteroid.sizeLevel - 1;
    asteroids.push(createAsteroid(smallerSize, asteroid.x, asteroid.y));
    asteroids.push(createAsteroid(smallerSize, asteroid.x, asteroid.y));
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateShip();
  updateAsteroids();
  updateBullets();
  checkCollisions();

  drawShip();
  drawAsteroids();
  drawBullets();

  updateScore();

  if (lives > 0) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function updateScore() {
  document.getElementById("scoreValue").textContent = score
  document.getElementById("levelValue").textContent = level
  document.getElementById("livesValue").textContent = lives
}

function gameOver() {
  ctx.fillStyle = "#0f0"
  ctx.font = "40px Courier"
  ctx.textAlign = "center"
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") ship.rotation = 0.1
  if (e.key === "ArrowRight") ship.rotation = -0.1
  if (e.key === "ArrowUp") ship.thrusting = true
  if (e.key === " ") {
    bullets.push({
      x: ship.x + (4 / 3) * ship.radius * Math.cos(ship.angle),
      y: ship.y - (4 / 3) * ship.radius * Math.sin(ship.angle),
      xv: 5 * Math.cos(ship.angle),
      yv: -5 * Math.sin(ship.angle),
    })
  }
})

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") ship.rotation = 0
  if (e.key === "ArrowUp") ship.thrusting = false
})

document.getElementById("startButton").addEventListener("click", () => {
  score = 0;
  level = 1;
  lives = 3;
  asteroids = [];
  bullets = [];
  createAsteroids(3);
  resetShip();

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  animationId = requestAnimationFrame(gameLoop);

  updateScore();
});
document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused;
  if (isPaused) {
    cancelAnimationFrame(animationId);
  } else {
    animationId = requestAnimationFrame(gameLoop);
  }
});

// Initial setup
createAsteroids(3)
updateScore()

