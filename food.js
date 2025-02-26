// Initialize food at game start
let food = {x: 15, y: 15, value: 1};

// Draws food on the game board
function drawFood() {
    const centerX = food.x * gridSize + gridSize/2;
    const centerY = food.y * gridSize + gridSize/2;
    const radius = gridSize/2 - 2;

    // Draws food visually
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draws the number value of the food
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(food.value.toString(), centerX, centerY);
}

// Generates food on the game board
function generateFood() {
    let validPosition = false;
    while (!validPosition) {

        // Generate food in a random position
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        // Ensure position of food does not overlap with snake
        validPosition = true;
        for (let segment of snake) {
            if (food.x === segment.x && food.y === segment.y) {
                validPosition = false;
                break;
            }
        }
    }

    // Assign random food value
    food.value = Math.floor(Math.random() * 5) + 1;
}

// Checks if the snake has collided with food
function checkFoodCollision() {

    // If snake head "eats" food, snake grows and 
    // food is regenerated
    if (snake[0].x === food.x && snake[0].y === food.y) {
        
        score += food.value;
        scoreElement.textContent = `Score: ${score}`;

        // Grow snake by the number value eaten - 1 as we already added the head
        for (let i = 0; i < food.value - 1; i++) {
            snake.push({...snake[snake.length - 1]});
        }

        // Regenerate food
        generateFood();

        // Generate spikes in new positions
        updateSpikes();
        return true;
    }
    return false;
}