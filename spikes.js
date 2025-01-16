// Initialize Spikes at Game Start
let orangeSpikes = [{x: 5, y: 5}];
let redSpikes = [];
let pinkSpikes = [];

// Draws All Types of Spikes (Orange, Red, Pink)
function drawAllSpikes() {
    drawSpikeType(orangeSpikes, '#FFA500', '#804000');
    drawSpikeType(redSpikes, '#FF0000', '#800000');
    drawSpikeType(pinkSpikes, '#FF69B4', '#8B3A62');
}

// Draws a Specific Type of Spike (Orange, Red, Pink)
function drawSpikeType(spikes, fillColor, strokeColor) {
    spikes.forEach(spike => {

        const centerX = spike.x * gridSize + gridSize/2;
        const centerY = spike.y * gridSize + gridSize/2;
        const radius = gridSize/2 - 2;
        
        // Draws Spike Visually
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.strokeStyle = fillColor;
        ctx.lineWidth = 1.5;
        
        // Adds Straight Lines Coming Out of the Spike
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

        // Draw Black X on Spike
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

// Moves the Red Spikes (Only Horizontal/Vertical Movement)
function moveRedSpikes() {
    redSpikeMoveCounter++;

    // Moves One Space Every Second
    if(redSpikeMoveCounter % 10 !== 0) return;

    redSpikes.forEach(spike => {
        const directions = [
            {dx: -1, dy: 0},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1},
            {dx: 0, dy: 1}
        ];

        const validDirections = getValidDirections(spike, directions);

        // Moves Spike in a Random Valid Direction
        if(validDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * validDirections.length);
            const randomDirection = validDirections[randomIndex];
            spike.x += randomDirection.dx;
            spike.y += randomDirection.dy;
        }
    });
}

// Moves the Pink Spikes (All Directions Including Diagonal)
function movePinkSpikes() {
    pinkSpikeMoveCounter++;

    // Moves One Space Every 0.5 Seconds
    if(pinkSpikeMoveCounter % 5 !== 0) return;

    pinkSpikes.forEach(spike => {
        const directions = [
            {dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1},
            {dx: -1, dy: -1}, {dx: -1, dy: 1}, {dx: 1, dy: -1}, {dx: 1, dy: 1}
        ];

        const validDirections = getValidDirections(spike, directions);

        // Moves Spike in a Random Valid Direction
        if(validDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * validDirections.length);
            const randomDirection = validDirections[randomIndex];
            spike.x += randomDirection.dx;
            spike.y += randomDirection.dy;
        }
    });
}

// Updates Spike Positions Based on Score
function updateSpikes() {
    // Calculate Spike Counts Based on Score
    const orangeSpikeCount = Math.ceil(score / 10);
    const redSpikeCount = Math.floor(score / 25);
    const pinkSpikeCount = Math.floor(score / 65);

    orangeSpikes = [];
    redSpikes = [];
    pinkSpikes = [];

    // Generates Spikes of Each Type on the Game Board
    generateSpikeType(orangeSpikes, orangeSpikeCount);
    generateSpikeType(redSpikes, redSpikeCount);
    generateSpikeType(pinkSpikes, pinkSpikeCount);
}

// Generates Spikes of a Specific Type on the Game Board
function generateSpikeType(spikeArray, count) {

    for(let i = 0; i < count; i++) {
        let spike;

        // Generates Spike in a Random Valid Position
        do {
            spike = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (!isValidSpikePosition(spike));

        spikeArray.push(spike);
    }
}

// Checks if a Position is Valid for a Spike
function isValidSpikePosition(spike) {

    const head = snake[0];

    // Ensures Spike is at Least 5 Spaces Away from Snake Head
    const dx = spike.x - head.x;
    const dy = spike.y - head.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 5) return false;

    // Check If Spike Overlaps with Snake
    for(let segment of snake) {
        if(spike.x === segment.x && spike.y === segment.y) return false;
    }

    // Check If Spike Overlaps with Food
    if(spike.x === food.x && spike.y === food.y) return false;

    // Check If Spike Overlaps with Other Spikes
    for(let existingSpike of [...orangeSpikes, ...redSpikes, ...pinkSpikes]) {
        if(spike.x === existingSpike.x && spike.y === existingSpike.y) return false;
    }

    return true;
}

// Gets Valid Directions for Spike Movement
function getValidDirections(spike, directions) {

    return directions.filter(dir => {
        const newX = spike.x + dir.dx;
        const newY = spike.y + dir.dy;
        
        // Prevent Spike from Moving Out of Bounds
        if(newX < 0 || newX >= tileCount || newY < 0 || newY >= tileCount) return false;
        
        // Prevent Spike from Moving Into Snake
        for(let segment of snake) {
            if(segment.x === newX && segment.y === newY) return false;
        }
        
        // Prevent Spike from Moving Into Food
        if(food.x === newX && food.y === newY) return false;
        
        // Prevent Spike from Moving Into Other Spikes
        for(let otherSpike of [...orangeSpikes, ...redSpikes, ...pinkSpikes]) {
            if(otherSpike !== spike && otherSpike.x === newX && otherSpike.y === newY) return false;
        }
        
        return true;
    });
} 