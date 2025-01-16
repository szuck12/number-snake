// Initialize Game Elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

// Calculate Tile Count Based on Canvas Width
const tileCount = canvas.width / gridSize;

// Add Event Listener for Keyboard Input
document.addEventListener('keydown', changeDirection);

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

// Start the Game
drawGame(); 