// Initialize Game Elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const instructionsPopup = document.getElementById('instructions-popup');
const startGameBtn = document.getElementById('start-game-btn');

// Calculate Tile Count Based on Canvas Width
const tileCount = canvas.width / gridSize;

// Add Event Listeners
document.addEventListener('keydown', changeDirection);
startGameBtn.addEventListener('click', startGame);

// Show Instructions Initially
instructionsPopup.style.display = 'block';
let gameStarted = false;

// Function to Show Instructions
function showInstructions() {

    instructionsPopup.style.display = 'block';
    drawExamples();
    
    if (gameStarted) {
        // Pause the game if it's already running
        clearTimeout(gameLoop);
    }
}

// Function to Start Game
function startGame() {

    instructionsPopup.style.display = 'none';

    if (!gameStarted) {
        gameStarted = true;
        drawGame();
    } else {
        // Resume game if it was paused
        drawGame();
    }
}

function drawGame() {
    setBoard();

    // Move Snake and Spikes
    moveSnake();
    moveRedSpikes();
    movePinkSpikes();

    // Draw Snake, Food, and Spikes
    drawSnake();
    drawFood();
    drawAllSpikes();
    
    if (gameOver()) {
        endGame();
        return;
    }
    
    checkFoodCollision();

    // Run a "Move" of Game Every 100 milliseconds
    gameLoop = setTimeout(drawGame, 100);
}

// Draw Example Illustrations As Part of Instructions
function drawExamples() {

    const snakeCanvas = document.getElementById('snake-example');
    const snakeCtx = snakeCanvas.getContext('2d');
    
    // Draw snake example
    for(let i = 0; i < 4; i++) {
        const greenValue = 175 - (i * 2);
        snakeCtx.fillStyle = `rgb(76, ${greenValue}, 80)`;
        snakeCtx.fillRect(i * 20, 6, 18, 18);  // Centered vertically
        snakeCtx.strokeStyle = '#FFFFFF';
        snakeCtx.strokeRect(i * 20, 6, 18, 18);
    }

    const foodCanvas = document.getElementById('food-example');
    const foodCtx = foodCanvas.getContext('2d');
    
    // Draw circle
    foodCtx.fillStyle = '#FFFFFF';
    foodCtx.beginPath();
    foodCtx.arc(15, 15, 13, 0, Math.PI * 2);
    foodCtx.fill();
    foodCtx.strokeStyle = '#4CAF50';
    foodCtx.lineWidth = 2;
    foodCtx.stroke();
    
    // Draw circle number
    foodCtx.fillStyle = '#000000';
    foodCtx.font = 'bold 16px Arial';
    foodCtx.textAlign = 'center';
    foodCtx.textBaseline = 'middle';
    foodCtx.fillText('3', 15, 15);

    const spikeTypes = [
        {id: 'orange-spike-example', color: '#FFA500', stroke: '#804000'},
        {id: 'red-spike-example', color: '#FF0000', stroke: '#800000'},
        {id: 'pink-spike-example', color: '#FF69B4', stroke: '#8B3A62'}
    ];

    // Draw spike examples
    spikeTypes.forEach(type => {
        const spikeCanvas = document.getElementById(type.id);
        const spikeCtx = spikeCanvas.getContext('2d');
        
        // Draw spike circle
        const centerX = 15;
        const centerY = 15;
        const radius = 13;

        spikeCtx.fillStyle = type.color;
        spikeCtx.beginPath();
        spikeCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        spikeCtx.fill();
        spikeCtx.strokeStyle = type.stroke;
        spikeCtx.lineWidth = 2;
        spikeCtx.stroke();

        // Draw tics angling out from center of the spikes
        spikeCtx.strokeStyle = type.color;
        spikeCtx.lineWidth = 1.5;
        
        for(let i = 0; i < 8; i++) {
            const angle = (i * Math.PI / 4);
            const legLength = radius * 1.2;
            
            spikeCtx.beginPath();
            spikeCtx.moveTo(centerX, centerY);
            
            const endX = centerX + Math.cos(angle) * legLength;
            const endY = centerY + Math.sin(angle) * legLength;
            
            spikeCtx.lineTo(endX, endY);
            spikeCtx.stroke();
        }

        spikeCtx.strokeStyle = '#000000';
        spikeCtx.lineWidth = 2;
        const padding = 7;

        // Draw X's on the spikes
        spikeCtx.beginPath();
        spikeCtx.moveTo(centerX - padding/2, centerY - padding/2);
        spikeCtx.lineTo(centerX + padding/2, centerY + padding/2);
        spikeCtx.moveTo(centerX + padding/2, centerY - padding/2);
        spikeCtx.lineTo(centerX - padding/2, centerY + padding/2);
        spikeCtx.stroke();
    });
}

// Draw Examples When Page Loads
drawExamples(); 