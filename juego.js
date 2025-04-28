const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

// — Texturas —
const imgGrass   = new Image(); imgGrass.src   = "./tierra.jpg";
const imgWool    = new Image(); imgWool.src    = "./lana.webp";
const imgCreeper = new Image(); imgCreeper.src = "./camper.png";

// — Estados de juego —
let gameWon        = false;
let gameLost       = false;
let confetti       = [];
let confettiActive = false;

// — Entidades —
const player = {
  x:100, y:550, width:50, height:50,
  dx:0, dy:0, speed:5,
  gravity:0.8, jumpPower:-15,
  grounded:false
};
const platforms = [
  { x:0,   y:580, width:800, height:20 },
  { x:200, y:450, width:150, height:20 },
  { x:400, y:350, width:150, height:20 },
  { x:600, y:250, width:150, height:20 }
];
const enemy = { x:600, y:540, width:40, height:40, dx:-3 };
const wool  = { x:700, y:220, width:30, height:30 };

// — Confeti de lanas —
function spawnConfetti() {
  const colors = ["#FF5555","#55FF55","#5555FF","#FFFF55","#FF55FF","#55FFFF"];
  confetti = [];
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * 800,
      y: -Math.random() * 600,
      dy: 2 + Math.random() * 3,
      size: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  confettiActive = true;
}
function updateConfetti() {
  confetti.forEach(c => c.y += c.dy);
}
function drawConfetti() {
  confetti.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x, c.y, c.size, c.size);
  });
}

// — Dibujos —
function drawPlayer() {
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
function drawPlatforms() {
  ctx.fillStyle = "green";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}
function drawEnemy() {
  if (imgCreeper.complete) {
    ctx.drawImage(imgCreeper, enemy.x, enemy.y - enemy.height, enemy.width, enemy.height * 2);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
}
function drawWool() {
  if (imgWool.complete) {
    ctx.drawImage(imgWool, wool.x, wool.y, wool.width, wool.height);
  } else {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(wool.x, wool.y, wool.width, wool.height);
  }
}
function drawWinScreen() {
  ctx.fillStyle = "#87CEEB"; ctx.fillRect(0,0,800,600);
  ctx.fillStyle = "#A9DFBF"; ctx.fillRect(0,580,800,20);
  ctx.fillStyle = "black";
  ctx.font = "40px Arial"; ctx.textAlign = "center";
  ctx.fillText("¡Feliz Cumpleaños!", 400, 260);
  ctx.font = "20px Arial";
  ctx.fillText("¡Has capturado la lana!", 400, 300);
  if (confettiActive) {
    updateConfetti();
    drawConfetti();
  }
  ctx.font = "16px Arial";
  ctx.fillText("Tu primera lana, queemocion :D", 400, 350);
}
function drawLoseScreen() {
  ctx.fillStyle = "#000"; ctx.fillRect(0,0,800,600);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial"; ctx.textAlign = "center";
  ctx.fillText("¡Te atrapó el focusero!", 400, 300);
  ctx.font = "20px Arial";
  ctx.fillText("Pulsa R para reintentar", 400, 350);
}

// — Lógica —
function updatePlayer() {
  player.x += player.dx;
  player.x = Math.max(0, Math.min(800 - player.width, player.x));
  if (!player.grounded) player.dy += player.gravity; else player.dy = 0;
  player.y += player.dy;
  player.grounded = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height >= p.y &&
      player.y + player.height <= p.y + p.height + player.dy
    ) {
      player.grounded = true;
      player.y = p.y - player.height;
    }
  });
  if (player.y + player.height > 600) {
    player.y = 600 - player.height;
    player.grounded = true;
  }
}
function moveEnemy() {
  enemy.x += enemy.dx;
  if (enemy.x < 0 || enemy.x + enemy.width > 800) enemy.dx *= -1;
}
function checkWoolCollision() {
  if (
    player.x < wool.x + wool.width &&
    player.x + player.width > wool.x &&
    player.y < wool.y + wool.height &&
    player.y + player.height > wool.y
  ) {
    gameWon = true;
    spawnConfetti();
  }
}
function checkEnemyCollision() {
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    gameLost = true;
  }
}

// — Bucle principal —
function gameLoop() {
  ctx.clearRect(0,0,800,600);

  if (gameWon) {
    drawWinScreen();
    requestAnimationFrame(gameLoop);
    return;
  }
  if (gameLost) {
    drawLoseScreen();
    requestAnimationFrame(gameLoop);
    return;
  }

  drawPlatforms();
  drawPlayer();
  drawEnemy();
  drawWool();

  updatePlayer();
  moveEnemy();
  checkWoolCollision();
  checkEnemyCollision();

  requestAnimationFrame(gameLoop);
}
gameLoop();

// — Controles —
function jump() {
  if (player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
}
window.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === "ArrowUp" || e.key === " ") jump();
  if (e.key.toLowerCase() === "r" && (gameWon || gameLost)) {
    // Reinicio
    gameWon        = false;
    gameLost       = false;
    confettiActive = false;
    confetti.length = 0;
    // Reset posiciones
    player.x = 100; player.y = 550; player.dx = 0; player.dy = 0; player.grounded = false;
    enemy.x  = 600; enemy.dx  = -3;
    wool.x   = 700; wool.y   = 220;
    // sigue el bucle automáticamente
  }
});
