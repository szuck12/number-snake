// Initialize Snake at Game Start
let snake = [
    {x: 10, y: 10},
];

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
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (!checkFoodCollision() && !isGameOver) {
        snake.pop();
    }
}

// Function to Change Direction of Snake
function changeDirection(event) {
    // Keys
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = event.keyCode;

    // Current Direction
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    
    // Changes Direction of Snake, But Not If the Desired Move is in the Opposite Direction
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
} 