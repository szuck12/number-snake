// Board management
function setBoard() {

    // Reset game board at the start of each frame
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Design game board
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 0.5;

    for(let i = 0; i < tileCount; i++) {
        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        // Draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}
 
// Checks if the game has ended
function gameOver() {
    const head = snake[0];
    
    // Check if snake is out of bounds
    const outOfBounds = head.x < 0 || head.x >= tileCount ||
                        head.y < 0 || head.y >= tileCount;
    
    if (outOfBounds) {
        return true;
    }
    
    // Check if snake has collided with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    // Check if snake has collided with any spikes
    const allSpikes = [...orangeSpikes, ...redSpikes, ...pinkSpikes];
    for(let spike of allSpikes) {
        if(head.x === spike.x && head.y === spike.y) {
            return true;
        }
    }
    
    return false;
}

// Ends the game visually and stops the game loop
function endGame() {
    clearTimeout(gameLoop);

    isGameOver = true;
    gameReady = false;
    gameStarted = false;

    // Reset movement values to prevent any lingering movement
    dx = 0;
    dy = 0;
    lastDirection = null;
    pendingDirection = null;

    gameOverElement.style.display = 'block';
    
    // Ensure mode buttons are interactive when game ends
    modeButtons.classList.remove('no-hover');
    modeButtons.classList.add('hover');
}

// Resets the game
function resetGame() {
    
    // Reset game states and variables
    isGameOver = false;
    gameReady = true;
    gameStarted = false;
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15, value: 1};
    orangeSpikes = [{x: 5, y: 5}];
    redSpikes = [];
    pinkSpikes = [];
    dx = 0;
    dy = 0;
    lastDirection = null;
    pendingDirection = null;
    score = 0;
    redSpikeMoveCounter = 0;
    pinkSpikeMoveCounter = 0;

    // Reset score display and screen
    scoreElement.textContent = `Score: ${score}`;
    gameOverElement.style.display = 'none';

    // Ensure mode buttons are interactive
    modeButtons.classList.remove('no-hover');
    modeButtons.classList.add('hover');

    drawGame();
}