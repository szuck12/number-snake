// Initialize Food at Game Start
let food = {x: 15, y: 15, value: 1};

// Draws Food on the Game Board
function drawFood() {
    const centerX = food.x * gridSize + gridSize/2;
    const centerY = food.y * gridSize + gridSize/2;
    const radius = gridSize/2 - 2;

    // Draws Food Visually
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draws the Number Value of the Food
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(food.value.toString(), centerX, centerY);
}

// Generates Food on the Game Board
function generateFood() {
    let validPosition = false;
    while (!validPosition) {

        // Generate Food in a Random Position
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);

        // Ensure Position Of Food Does Not Overlap With Snake
        validPosition = true;
        for (let segment of snake) {
            if (food.x === segment.x && food.y === segment.y) {
                validPosition = false;
                break;
            }
        }
    }

    // Assign Random Food Value
    food.value = Math.floor(Math.random() * 5) + 1;
}

// Checks if the Snake has Collided with Food
function checkFoodCollision() {

    // If Snake Head "Eats" Food, Snake Grows and 
    // Food is Regenerated
    if (snake[0].x === food.x && snake[0].y === food.y) {
        
        score += food.value;
        scoreElement.textContent = `Score: ${score}`;

        // Grow Snake by the Number Value Eaten - 1 As We Already Added the Head
        for (let i = 0; i < food.value - 1; i++) {
            snake.push({...snake[snake.length - 1]});
        }

        // Regenerate Food
        generateFood();

        // Generate Spikes In New Positions
        updateSpikes();
        return true;
    }
    return false;
} 