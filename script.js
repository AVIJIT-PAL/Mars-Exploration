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

// --- INPUT HANDLING ---

// Keyboard Support
window.addEventListener("keydown", (e) => { if (e.code === "Space" && gameActive) isThrusting = true; });
window.addEventListener("keyup", (e) => { if (e.code === "Space") isThrusting = false; });

// Mobile Touch Button Logic
const btn = document.createElement("button");
btn.innerText = "THRUST";
btn.style.position = "absolute";
btn.style.bottom = "50px";
btn.style.padding = "20px 40px";
btn.style.fontSize = "20px";
btn.style.backgroundColor = "#ff9900";
btn.style.border = "none";
btn.style.borderRadius = "10px";
document.body.appendChild(btn);

btn.addEventListener("touchstart", (e) => { e.preventDefault(); if (gameActive) isThrusting = true; });
btn.addEventListener("touchend", (e) => { e.preventDefault(); isThrusting = false; });

// --- GAME LOGIC ---

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

function checkWinCondition() {
    if (velocity <= safeLandingSpeed) {
        statusMessage.style.color = "#00ffcc";
        statusMessage.innerText = "MISSION SUCCESS: Perfect Landing!";
    } else {
        statusMessage.style.color = "#ff3333";
        statusMessage.innerText = "MISSION FAILED: High-Velocity Impact.";
    }
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Mars Ground
    ctx.fillStyle = "#cc5500"; 
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Rocket Body (The lander)
    const centerX = canvas.width / 2;
    const landerY = canvas.height - 50 - altitude - 40; 
    
    // Main Body
    ctx.fillStyle = "#e0e0e0"; 
    ctx.fillRect(centerX - 15, landerY, 30, 40);

    // Nose Cone (Triangle on top)
    ctx.fillStyle = "#ff5555"; // Red accent for the top
    ctx.beginPath();
    ctx.moveTo(centerX - 15, landerY);
    ctx.lineTo(centerX + 15, landerY);
    ctx.lineTo(centerX, landerY - 15);
    ctx.fill();

    // Landing Legs
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 15, landerY + 40);
    ctx.lineTo(centerX - 25, landerY + 55); // Left leg
    ctx.moveTo(centerX + 15, landerY + 40);
    ctx.lineTo(centerX + 25, landerY + 55); // Right leg
    ctx.stroke();

    // Thrust Plume
    if (isThrusting && fuel > 0) {
        ctx.fillStyle = "#ffaa00"; 
        ctx.beginPath();
        ctx.moveTo(centerX - 10, landerY + 40);
        ctx.lineTo(centerX + 10, landerY + 40);
        ctx.lineTo(centerX, landerY + 70 + Math.random() * 15); 
        ctx.fill();
    }
}
}

updateGame();
