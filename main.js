// Initialize game elements
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const instructionsPopup = document.getElementById('instructions-popup');
const readyGameBtn = document.getElementById('ready-game-btn');

// Calculate tile count based on canvas width
const tileCount = canvas.width / gridSize;

// Mode buttons
const modeButtons = document.getElementById('mode-buttons');
const normalButton = document.getElementById('normal-mode-btn');
const fastButton = document.getElementById('fast-mode-btn');

readyGameBtn.addEventListener('click', readyGame);

// Show instructions initially
instructionsPopup.style.display = 'block';
gameStarted = false;
gameReady = false;

// Function to show instructions
function showInstructions() {

    gameReady = false;

    instructionsPopup.style.display = 'block';
    drawExamples();
    
    // Pauses game if instructions are clicked during game
    if (gameStarted) {
        clearTimeout(gameLoop);
    }
}

// Add button hover effect
function addButtonHover() {
    modeButtons.classList.add('hover');
    modeButtons.classList.remove('no-hover');
}
// Remove button hover effect
function removeButtonHover() {
    modeButtons.classList.remove('hover');
    modeButtons.classList.add('no-hover');
}

// Initialize mode buttons and length of frame
function setGameMode(mode) {
    
    if (!gameStarted) {
        normalButton.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
        fastButton.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';

        if (mode === 'normal') {
            normalButton.style.backgroundColor = '#4F5053'; 
            timeFrame = 150;
        } else if (mode === 'fast') {
            fastButton.style.backgroundColor = '#4F5053';
            timeFrame = 100;
        }
    }
}

// Function to start game
function readyGame() {

    // Clear any existing game loop before starting a new one
    if (gameLoop) {
        clearTimeout(gameLoop);
    }
    
    gameReady = true; 
    addButtonHover();

    instructionsPopup.style.display = 'none';
    drawGame();

    // Set gameStarted when key is pressed, and remove mode button hover effect
    const keydownHandler = function(event) {
        // Only process arrow keys if instructions aren't showing
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && 
            gameReady && !isGameOver && instructionsPopup.style.display === 'none') {
            if (!gameStarted) {
                gameStarted = true;
                removeButtonHover();
            }
            changeDirection(event);
        }
    };

    // Add new keydown listener
    document.addEventListener('keydown', keydownHandler);

    // If a mode button is clicked, set mode button color and length of frame
    document.querySelectorAll('#mode-buttons button').forEach(button => {
        button.addEventListener('click', function () {
            if (!gameStarted) {
                setGameMode(this.id === 'normal-mode-btn' ? 'normal' : 'fast');
            }
        });
    });
}

// Responsible for drawing one frame of snake game
function drawGame() {
    setBoard();

    // Move snake and spikes
    moveSnake();
    moveRedSpikes();
    movePinkSpikes();

    // Draw snake, food, and spikes
    drawSnake();
    drawFood();
    drawAllSpikes();
    
    if (gameOver()) {
        endGame();
        addButtonHover();
        return;
    }
    
    checkFoodCollision();

    // Run a frame of game every "timeFrame" milliseconds
    gameLoop = setTimeout(drawGame, timeFrame);
}

// Draw example illustrations as part of instructions
function drawExamples() {

    const snakeCanvas = document.getElementById('snake-example');
    const snakeCtx = snakeCanvas.getContext('2d');
    
    // Draw snake example
    for(let i = 0; i < 4; i++) {
        const greenValue = 175 - (i * 2);
        snakeCtx.fillStyle = `rgb(76, ${greenValue}, 80)`;
        snakeCtx.fillRect(i * 20, 6, 18, 18);
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

// Draw examples when page loads
drawExamples();

// Initialize with game mode normal
setGameMode('normal');