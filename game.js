const gameArea = document.getElementById("gameArea");
const playerCar = document.getElementById("playerCar");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let gameOver = false;

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    a: false,
    d: false,
    w: false,
    s: false
};

const player = {
    x: 175,
    y: 490,
    speed: 6
};

let obstacles = [];

// Keyboard Controls
document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Create Obstacle
function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    const lanes = [50, 175, 300];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    obstacle.style.left = lane + "px";
    obstacle.style.top = "-100px";

    gameArea.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        x: lane,
        y: -100,
        speed: 4 + Math.random() * 3
    });
}

// Collision Detection
function isColliding(rect1, rect2) {
    return !(
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.left > rect2.right
    );
}

// Update Game
function update() {

    if (gameOver) return;

    // Movement
    if (keys.ArrowLeft || keys.a) {
        player.x -= player.speed;
    }

    if (keys.ArrowRight || keys.d) {
        player.x += player.speed;
    }

    if (keys.ArrowUp || keys.w) {
        player.y -= player.speed;
    }

    if (keys.ArrowDown || keys.s) {
        player.y += player.speed;
    }

    // Boundaries
    player.x = Math.max(0, Math.min(350, player.x));
    player.y = Math.max(0, Math.min(510, player.y));

    playerCar.style.left = player.x + "px";
    playerCar.style.top = player.y + "px";

    const playerRect = playerCar.getBoundingClientRect();

    obstacles.forEach((obs, index) => {

        obs.y += obs.speed;
        obs.element.style.top = obs.y + "px";

        const obstacleRect = obs.element.getBoundingClientRect();

        // Collision
        if (isColliding(playerRect, obstacleRect)) {
            endGame();
        }

        // Passed obstacle
        if (obs.y > 650) {
            obs.element.remove();
            obstacles.splice(index, 1);

            score++;
            scoreElement.textContent = score;
        }
    });

    requestAnimationFrame(update);
}

// Spawn Obstacles
setInterval(() => {
    if (!gameOver) {
        createObstacle();
    }
}, 1200);

// End Game
function endGame() {
    gameOver = true;

    alert("Game Over!\nScore: " + score);

    restartBtn.style.display = "inline-block";
}

// Restart
restartBtn.addEventListener("click", () => {
    location.reload();
});

// Start Game
update();