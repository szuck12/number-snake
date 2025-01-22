// Initialize Snake at Game Start
let snake = [
    {x: 10, y: 10},
];

// lastDirection holds the last direction the snake moved in the current frame
let lastDirection = null;

// pendingDirection holds a "queued" direction change. This occurs when the 
// user tries to complete two valid turns within the same frame
let pendingDirection = null;

// Draws the Snake
function drawSnake() {
    snake.forEach((segment, index) => {

        // Allows For Snake To Darken Towards Tail
        const greenValue = 175 - (index * 2);

        // Creates Snake
        ctx.fillStyle = `rgb(76, ${greenValue}, 80)`;
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(x, y, gridSize - 2, gridSize - 2);
    });
}

// Moves the Snake on the Game Board
function moveSnake() {

    // Set lastDirection based on current movement if not already set
    if (!lastDirection) {
        if (dy === -1) lastDirection = 'up';
        else if (dy === 1) lastDirection = 'down';
        else if (dx === -1) lastDirection = 'left';
        else if (dx === 1) lastDirection = 'right';
    }

    // Move the Snake
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (!checkFoodCollision() && !isGameOver) {
        snake.pop();
    }

    // Reset lastDirection after movement
    lastDirection = null;

    // After movement, apply pending direction change (if there is one)
    if (pendingDirection) {
        console.log('Applying pending direction:', pendingDirection);
        switch(pendingDirection) {
            case 'left':
                dx = -1;
                dy = 0;
                break;
            case 'up':
                dx = 0;
                dy = -1;
                break;
            case 'right':
                dx = 1;
                dy = 0;
                break;
            case 'down':
                dx = 0;
                dy = 1;
                break;
        }

        // Update lastDirection to the pending direction, and clear pendingDirection
        lastDirection = pendingDirection;
        pendingDirection = null;
    }
}

// Function to check if this is a valid second turn (90 degrees only)
function isValidSecondTurn(direction, lastDirection) {
    if (!lastDirection) return false;
    
    // Define valid 90-degree turns for each direction
    const validTurns = {
        'up': ['left', 'right'],
        'down': ['left', 'right'],
        'left': ['up', 'down'],
        'right': ['up', 'down']
    };
    
    // Return true if it's a valid 90-degree turn from the last direction
    return validTurns[lastDirection]?.includes(direction);
}

// Function to Change Direction of Snake
function changeDirection(event) {

    // Key codes for arrow keys
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = event.keyCode;

    // Only accept a new direction if no direction is pending
    if (pendingDirection) {
        return;
    }
    
    // Determine direction based on key press, and make turn pending if valid
    let newDirection = null;
    if (keyPressed === LEFT_KEY && (!lastDirection ? dx !== 1 : true)) {
        newDirection = 'left';
    } else if (keyPressed === UP_KEY && (!lastDirection ? dy !== 1 : true)) {
        newDirection = 'up';
    } else if (keyPressed === RIGHT_KEY && (!lastDirection ? dx !== -1 : true)) {
        newDirection = 'right';
    } else if (keyPressed === DOWN_KEY && (!lastDirection ? dy !== -1 : true)) {
        newDirection = 'down';
    }

    if (newDirection) {
        if (!lastDirection) {

            // Apply first turn immediately, if no change of direction has 
            // occurred in the current frame
            switch(newDirection) {
                case 'left':
                    dx = -1;
                    dy = 0;
                    break;
                case 'up':
                    dx = 0;
                    dy = -1;
                    break;
                case 'right':
                    dx = 1;
                    dy = 0;
                    break;
                case 'down':
                    dx = 0;
                    dy = 1;
                    break;
            }

            lastDirection = newDirection;
            
        } else if (isValidSecondTurn(newDirection, lastDirection)) {

            // Queue valid second turn for next frame
            pendingDirection = newDirection;
        }
    }
} 