// Initialize spikes at game start
let orangeSpikes = [{x: 5, y: 5}];
let redSpikes = [];
let pinkSpikes = [];

// Draws all types of spikes (orange, red, pink)
function drawAllSpikes() {
    drawSpikeType(orangeSpikes, '#FFA500', '#804000');
    drawSpikeType(redSpikes, '#FF0000', '#800000');
    drawSpikeType(pinkSpikes, '#FF69B4', '#8B3A62');
}

// Draws a specific type of spike (orange, red, pink)
function drawSpikeType(spikes, fillColor, strokeColor) {
    spikes.forEach(spike => {

        const centerX = spike.x * gridSize + gridSize/2;
        const centerY = spike.y * gridSize + gridSize/2;
        const radius = gridSize/2 - 2;
        
        // Draws spike visually
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.strokeStyle = fillColor;
        ctx.lineWidth = 1.5;
        
        // Adds straight lines coming out of the spike
        for(let i = 0; i < 8; i++) {
            const angle = (i * Math.PI / 4);
            const legLength = radius * 1.2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            
            const endX = centerX + Math.cos(angle) * legLength;
            const endY = centerY + Math.sin(angle) * legLength;
            
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        // Draw black X on spike
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        const padding = 7;
        ctx.beginPath();
        ctx.moveTo(centerX - padding/2, centerY - padding/2);
        ctx.lineTo(centerX + padding/2, centerY + padding/2);
        ctx.moveTo(centerX + padding/2, centerY - padding/2);
        ctx.lineTo(centerX - padding/2, centerY + padding/2);
        ctx.stroke();
    });
}

// Moves the red spikes (only horizontal/vertical movement)
function moveRedSpikes() {
    redSpikeMoveCounter++;

    // Moves one space every second
    if(redSpikeMoveCounter % 10 !== 0) return;

    redSpikes.forEach(spike => {
        const directions = [
            {dx: -1, dy: 0},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1},
            {dx: 0, dy: 1}
        ];

        const validDirections = getValidDirections(spike, directions);

        // Moves spike in a random valid direction
        if(validDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * validDirections.length);
            const randomDirection = validDirections[randomIndex];
            spike.x += randomDirection.dx;
            spike.y += randomDirection.dy;
        }
    });
}

// Moves the pink spikes (all directions including diagonal)
function movePinkSpikes() {
    pinkSpikeMoveCounter++;

    // Moves one space every 0.5 seconds
    if(pinkSpikeMoveCounter % 5 !== 0) return;

    pinkSpikes.forEach(spike => {
        const directions = [
            {dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1},
            {dx: -1, dy: -1}, {dx: -1, dy: 1}, {dx: 1, dy: -1}, {dx: 1, dy: 1}
        ];

        const validDirections = getValidDirections(spike, directions);

        // Moves spike in a random valid direction
        if(validDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * validDirections.length);
            const randomDirection = validDirections[randomIndex];
            spike.x += randomDirection.dx;
            spike.y += randomDirection.dy;
        }
    });
}

// Updates spike positions based on score
function updateSpikes() {
    // Calculate spike counts based on score
    const orangeSpikeCount = Math.ceil(score / 10);
    const redSpikeCount = Math.floor(score / 25);
    const pinkSpikeCount = Math.floor(score / 65);

    orangeSpikes = [];
    redSpikes = [];
    pinkSpikes = [];

    // Generates spikes of each type on the game board
    generateSpikeType(orangeSpikes, orangeSpikeCount);
    generateSpikeType(redSpikes, redSpikeCount);
    generateSpikeType(pinkSpikes, pinkSpikeCount);
}

// Generates spikes of a specific type on the game board
function generateSpikeType(spikeArray, count) {

    for(let i = 0; i < count; i++) {
        let spike;

        // Generates spike in a random valid position
        do {
            spike = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (!isValidSpikePosition(spike));

        spikeArray.push(spike);
    }
}

// Checks if a position is valid for a spike
function isValidSpikePosition(spike) {

    const head = snake[0];

    // Ensures spike is at least 5 spaces away from snake head
    const dx = spike.x - head.x;
    const dy = spike.y - head.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) return false;

    // Check if spike overlaps with snake
    for(let segment of snake) {
        if(spike.x === segment.x && spike.y === segment.y) return false;
    }

    // Check if spike overlaps with food
    if(spike.x === food.x && spike.y === food.y) return false;

    // Check if spike overlaps with other spikes
    for(let existingSpike of [...orangeSpikes, ...redSpikes, ...pinkSpikes]) {
        if(spike.x === existingSpike.x && spike.y === existingSpike.y) return false;
    }

    return true;
}

// Gets valid directions for spike movement
function getValidDirections(spike, directions) {

    return directions.filter(dir => {
        const newX = spike.x + dir.dx;
        const newY = spike.y + dir.dy;
        
        // Prevent spike from moving out of bounds
        if(newX < 0 || newX >= tileCount || newY < 0 || newY >= tileCount) return false;
        
        // Prevent spike from moving into snake
        for(let segment of snake) {
            if(segment.x === newX && segment.y === newY) return false;
        }
        
        // Prevent spike from moving into food
        if(food.x === newX && food.y === newY) return false;
        
        // Prevent spike from moving into other spikes
        for(let otherSpike of [...orangeSpikes, ...redSpikes, ...pinkSpikes]) {
            if(otherSpike !== spike && otherSpike.x === newX && otherSpike.y === newY) return false;
        }
        
        return true;
    });
}