const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensiones del paddle
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

// Dimensiones de la pelota
const ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 3;
let ballDY = -3;

// Configuración de bloques
const blockRowCount = 5;
const blockColumnCount = 10;
const blockWidth = 60;
const blockHeight = 30;
const blockPadding = 8;
const blockOffsetTop = 30;
const blockOffsetLeft = 20;

// Puntos, nivel y estado del juego
let score = 0;
let level = 1;
let blocks;
let gameOver = false;
let highScores = [];

// Inicializa los bloques
function initializeBlocks() {
    blocks = [];
    for (let row = 0; row < blockRowCount; row++) {
        blocks[row] = [];
        for (let col = 0; col < blockColumnCount; col++) {
            const isIndestructible = Math.random() > 0.8;
            blocks[row][col] = {
                x: 0,
                y: 0,
                status: isIndestructible ? 2 : 1,
            };
        }
    }
}
initializeBlocks();

// Eventos del teclado
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

// Dibuja la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Dibuja el paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Dibuja los bloques
function drawBlocks() {
    for (let row = 0; row < blockRowCount; row++) {
        for (let col = 0; col < blockColumnCount; col++) {
            const block = blocks[row][col];
            if (block.status > 0) {
                const blockX = col * (blockWidth + blockPadding) + blockOffsetLeft;
                const blockY = row * (blockHeight + blockPadding) + blockOffsetTop;
                block.x = blockX;
                block.y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = block.status === 1 ? "#FF5733" : "#999999";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Dibuja la puntuación y nivel
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Score: ${score}`, 8, 20);
    ctx.fillText(`Level: ${level}`, canvas.width - 80, 20);
}

// Detecta colisiones
function collisionDetection() {
    for (let row = 0; row < blockRowCount; row++) {
        for (let col = 0; col < blockColumnCount; col++) {
            const block = blocks[row][col];
            if (block.status > 0) {
                if (
                    ballX > block.x &&
                    ballX < block.x + blockWidth &&
                    ballY > block.y &&
                    ballY < block.y + blockHeight
                ) {
                    ballDY = -ballDY;
                    if (block.status === 1) {
                        block.status = 0;
                        score += 10;
                    }
                }
            }
        }
    }
}

// Comprueba si todos los bloques han sido destruidos
function checkLevelComplete() {
    const allBlocksDestroyed = blocks.flat().every((block) => block.status !== 1);
    if (allBlocksDestroyed) {
        level++;
        ballDX *= 1.1;
        ballDY *= 1.1;
        initializeBlocks();
    }
}

// Finaliza la partida
function endGame() {
    gameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Game Over!", canvas.width / 2 - 60, canvas.height / 2 - 20);
    ctx.fillText(`Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2);
    ctx.fillText("Enter your name:", canvas.width / 2 - 80, canvas.height / 2 + 30);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.style.position = "absolute";
    nameInput.style.left = `${canvas.offsetLeft + canvas.width / 2 - 80}px`;
    nameInput.style.top = `${canvas.offsetTop + canvas.height / 2 + 50}px`;
    document.body.appendChild(nameInput);

    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.style.position = "absolute";
    submitButton.style.left = `${canvas.offsetLeft + canvas.width / 2}px`;
    submitButton.style.top = `${canvas.offsetTop + canvas.height / 2 + 50}px`;
    document.body.appendChild(submitButton);

    submitButton.addEventListener("click", () => {
        const name = nameInput.value || "Anonymous";
        highScores.push({ name, score });
        highScores.sort((a, b) => b.score - a.score);
        nameInput.remove();
        submitButton.remove();
        showHighScores();
        createPlayAgainButton();
    });
}

// Muestra la tabla de puntuaciones
function showHighScores() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("High Scores", canvas.width / 2 - 60, 50);

    highScores.slice(0, 5).forEach((entry, index) => {
        ctx.fillText(
            `${index + 1}. ${entry.name} - ${entry.score}`,
            canvas.width / 2 - 100,
            80 + index * 30
        );
    });
}

// Crea un botón para jugar de nuevo
function createPlayAgainButton() {
    const playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again";
    playAgainButton.style.position = "absolute";
    playAgainButton.style.left = `${canvas.offsetLeft + canvas.width / 2 - 50}px`;
    playAgainButton.style.top = `${canvas.offsetTop + canvas.height - 50}px`;
    document.body.appendChild(playAgainButton);

    playAgainButton.addEventListener("click", () => {
        document.location.reload();
    });
}

// Actualiza el juego
function update() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBlocks();
    drawScore();
    collisionDetection();
    checkLevelComplete();

    ballX += ballDX;
    ballY += ballDY;

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballDX = -ballDX;
    }
    if (ballY - ballRadius < 0) {
        ballDY = -ballDY;
    } else if (ballY + ballRadius > canvas.height) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
        } else {
            endGame();
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    requestAnimationFrame(update);
}

// Inicia el juego
update();
