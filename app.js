const gameArea = document.getElementById("gameArea");
const letterEl = document.getElementById("letter");
const scoreEl = document.getElementById("score");
const hitsEl = document.getElementById("hits");
const missesEl = document.getElementById("misses");
const hitStreakEl = document.getElementById("hitStreak");
const missStreakEl = document.getElementById("missStreak");
const speedEl = document.getElementById("speed");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let score = 0;
let hits = 0;
let misses = 0;
let hitStreak = 0;
let missStreak = 0;

let speedMultiplier = 1;
const speedStep = 0.12;
const minSpeed = 0.55;
const maxSpeed = 2.4;
const baseSpeedPxPerSecond = 95;

let currentLetter = "";
let posX = 0;
let posY = 0;
let gameAreaWidth = 0;
let gameAreaHeight = 0;

function randomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function syncBounds() {
  gameAreaWidth = gameArea.clientWidth;
  gameAreaHeight = gameArea.clientHeight;
}

function spawnLetter() {
  syncBounds();
  currentLetter = randomLetter();
  posY = 0;
  posX = Math.random() * (gameAreaWidth - letterEl.offsetWidth);
  letterEl.textContent = currentLetter;
  letterEl.style.transform = `translate(${posX}px, ${posY}px)`;
}

function updateHud() {
  scoreEl.textContent = String(score);
  hitsEl.textContent = String(hits);
  missesEl.textContent = String(misses);
  hitStreakEl.textContent = String(hitStreak);
  missStreakEl.textContent = String(missStreak);
  speedEl.textContent = `${speedMultiplier.toFixed(2)}x`;
}

function speedUp() {
  speedMultiplier = Math.min(maxSpeed, speedMultiplier + speedStep);
}

function slowDown() {
  speedMultiplier = Math.max(minSpeed, speedMultiplier - speedStep);
}

function registerHit() {
  hits += 1;
  score += 1;
  hitStreak += 1;
  missStreak = 0;

  if (hitStreak >= 10) {
    speedUp();
    hitStreak = 0;
  }

  spawnLetter();
  updateHud();
}

function registerMiss() {
  misses += 1;
  score = Math.max(0, score - 1);
  missStreak += 1;
  hitStreak = 0;

  if (missStreak >= 10) {
    slowDown();
    missStreak = 0;
  }

  spawnLetter();
  updateHud();
}

document.addEventListener("keydown", (event) => {
  if (event.key.length !== 1 || !/[a-z]/i.test(event.key)) {
    return;
  }

  if (event.key.toUpperCase() === currentLetter) {
    registerHit();
  }
});

let lastFrame = performance.now();
function gameLoop(timestamp) {
  const dt = (timestamp - lastFrame) / 1000;
  lastFrame = timestamp;

  posY += baseSpeedPxPerSecond * speedMultiplier * dt;
  letterEl.style.transform = `translate(${posX}px, ${posY}px)`;

  const groundHeight = 28;
  const maxY = gameAreaHeight - groundHeight - letterEl.offsetHeight;
  if (posY >= maxY) {
    registerMiss();
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => {
  syncBounds();
  posX = Math.min(posX, gameAreaWidth - letterEl.offsetWidth);
  letterEl.style.transform = `translate(${posX}px, ${posY}px)`;
});

spawnLetter();
updateHud();
requestAnimationFrame((timestamp) => {
  lastFrame = timestamp;
  requestAnimationFrame(gameLoop);
});
