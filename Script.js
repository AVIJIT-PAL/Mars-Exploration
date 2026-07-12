// Setup Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI Elements
const altDisplay = document.getElementById("alt-display");
const velDisplay = document.getElementById("vel-display");
const fuelDisplay = document.getElementById("fuel-display");
const statusMessage = document.getElementById("status-message");

// Game Physics & Variables
let altitude = 700;       
let velocity = 2;         
let fuel = 100;           
const gravity = 0.05;     
const thrustPower = 0.15; 
const safeLandingSpeed = 2.0; 

let isThrusting = false;
let gameActive = true;

// Player Input
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameActive) {
        isThrusting = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        isThrusting = false;
    }
});

// Main Game Loop
function updateGame() {
    if (!gameActive) return;

    if (isThrusting && fuel > 0) {
        velocity -= thrustPower; 
        fuel -= 0.5; 
    }
    
    velocity += gravity; 
    altitude -= velocity; 

    if (altitude <= 0) {
        altitude = 0;
        gameActive = false;
        checkWinCondition();
    }

    altDisplay.innerText = Math.max(0, Math.round(altitude));
    velDisplay.innerText = velocity.toFixed(1);
    fuelDisplay.innerText = Math.max(0, Math.round(fuel));

    drawScene();

    if (gameActive) {
        requestAnimationFrame(updateGame);
    }
}

// Check Win/Loss
function checkWinCondition() {
    if (velocity <= safeLandingSpeed) {
        statusMessage.style.color = "#00ffcc";
        statusMessage.innerText = "MISSION SUCCESS: Perfect Landing!";
    } else {
        statusMessage.style.color = "#ff3333";
        statusMessage.innerText = "MISSION FAILED: High-Velocity Impact.";
    }
}

// Draw Graphics
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#cc5500"; 
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    const landerY = canvas.height - 50 - altitude - 30; 
    ctx.fillStyle = "#ffffff"; 
    ctx.fillRect(canvas.width / 2 - 15, landerY, 30, 30);

    if (isThrusting && fuel > 0) {
        ctx.fillStyle = "#ffaa00"; 
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 10, landerY + 30);
        ctx.lineTo(canvas.width / 2 + 10, landerY + 30);
        ctx.lineTo(canvas.width / 2, landerY + 60 + Math.random() * 10); 
        ctx.fill();
    }
}

updateGame();
