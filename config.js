// Initialize game variables
const gridSize = 20;
let score = 0;
let gameLoop;
let isGameOver = false;
let dx = 0;
let dy = 0;
let redSpikeMoveCounter = 0;
let pinkSpikeMoveCounter = 0; 

// Initialize game states and length of each frame
let timeFrame = 150;
let gameReady = false;
let gameStarted = false;