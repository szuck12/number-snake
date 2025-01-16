// Board Management
function setBoard() {

    // Reset Game Board at the Start of Each Frame
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Design Game Board
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 0.5;

    for(let i = 0; i < tileCount; i++) {
        // Draw Vertical Lines
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        // Draw Horizontal Lines
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

// Checks if the Game Has Ended
function gameOver() {
    const head = snake[0];
    
    // Check If Snake is Out of Bounds
    const outOfBounds = head.x < 0 || 
        head.x >= tileCount ||
        head.y < 0 || 
        head.y >= tileCount;
    
    if (outOfBounds) {
        return true;
    }
    
    // Check If Snake Has Collided With Itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    // Check If Snake Has Collided with Any Spikes
    const allSpikes = [...orangeSpikes, ...redSpikes, ...pinkSpikes];
    for(let spike of allSpikes) {
        if(head.x === spike.x && head.y === spike.y) {
            return true;
        }
    }
    
    return false;
}

// Ends the Game Visually and Stops the Game Loop
function endGame() {
    isGameOver = true;
    clearTimeout(gameLoop);
    gameOverElement.style.display = 'block';
}

// Resets the Game
function resetGame() {

    // Reset Game States and Variables
    isGameOver = false;
    snake = [{x: 10, y: 10}];
    food = {x: 15, y: 15, value: 1};
    orangeSpikes = [{x: 5, y: 5}];
    redSpikes = [];
    pinkSpikes = [];
    dx = 0;
    dy = 0;
    score = 0;
    redSpikeMoveCounter = 0;
    pinkSpikeMoveCounter = 0;

    // Reset Score Display and Screen
    scoreElement.textContent = `Score: ${score}`;
    gameOverElement.style.display = 'none';

    drawGame();
} 