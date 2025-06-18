// ===============================
// Game State Variables
// ===============================
let gameRunning = false; // Tracks if the game is active
let blueDropMaker;       // Interval for blue drops
let greenDropMaker;      // Interval for green drops
let scoreCounter;        // Score counter DOM element
let livesCounter;        // Lives counter DOM element

// ===============================
// DOMContentLoaded: Setup Event Listeners
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const startBucket = document.querySelector('.start-bucket');
    const startBucketImg = document.querySelector('.start-bucket-img');
    const difficultySelection = document.querySelector('.difficulty-selection');
    const difficultyOptions = document.querySelectorAll('.difficulty-btn');
    const gameContainer = document.querySelector('.game-container');
    const scoreLivesContainer = document.querySelector('.score-lives-container');
    const levelResetContainer = document.querySelector('.level-reset-container');
    // End screens
    const loseContainer = document.querySelector('.lose-container');
    const winContainer = document.querySelector('.win-container');

    // --- Start Game Logic ---
    if (startBucket && startBucketImg) {
        startBucketImg.addEventListener('click', function() {
            if (gameRunning) return;
            // Hide start overlay
            startBucket.style.display = 'none';

            // Play bucket sound
            const bucketSound = document.getElementById('bucket-sound');
            if (bucketSound) bucketSound.play();

            // Show difficulty selection
            if (difficultySelection) difficultySelection.classList.remove('hidden');
        });
    }

    // --- Difficulty Selection Logic ---
    if (difficultyOptions && difficultyOptions.length) {
        difficultyOptions.forEach(btn => {
            btn.addEventListener('click', function() {
                if (gameRunning) return;
                gameRunning = true;
                // Hide difficulty selection
                if (difficultySelection) difficultySelection.classList.add('hidden');

                // Show game instructions
                const messageDiv = document.getElementById('game-message');
                messageDiv.textContent = "Click the green droplets to stop them from falling in the bucket! Don't click the blue ones, they will cost you points!";

                // Set drop intervals based on difficulty
                let blueInterval = 500;
                let greenInterval = 1270;
                if (btn.classList.contains('easy-btn')) {
                    blueInterval = 500;
                    greenInterval = 2000;
                } else if (btn.classList.contains('medium-btn')) {
                    blueInterval = 500;
                    greenInterval = 1250;
                } else if (btn.classList.contains('hard-btn')) {
                    blueInterval = 500;
                    greenInterval = 700;
                }

                setTimeout(() => {
                    messageDiv.textContent = "";
                    if (gameContainer) gameContainer.classList.remove('hidden');
                    if (scoreLivesContainer) scoreLivesContainer.classList.remove('hidden');
                    if (levelResetContainer) levelResetContainer.classList.remove('hidden');

                    // Start drop creation intervals
                    blueDropMaker = setInterval(createBlueDrop, blueInterval);
                    greenDropMaker = setInterval(createGreenDrop, greenInterval);
                }, 5000);

                // Initialize score/lives counters
                scoreCounter = document.getElementById('score-value');
                livesCounter = document.getElementById('lives-value');

                // Log game start
                console.log("Game started with difficulty:", btn.textContent.trim());
            });
        });
    }

    // --- Reset/End Buttons ---
    const resetBtn = document.querySelector('.reset-btn');
    const tryAgainBtn = document.querySelector('.try-again-btn');
    const backBtn = document.querySelector('.back-btn');

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }
});

// ===============================
// Drop Creation Functions
// ===============================

// --- Create Blue Drop (Pure Water) ---
function createBlueDrop() {
    // Create drop element
    const drop = document.createElement("div");
    drop.className = "blue-water-drop";

    // Visual variety: random size
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.2 + 0.9;
    const size = initialSize * sizeMultiplier;
    drop.style.width = drop.style.height = `${size}px`;

    // Random horizontal position
    const gameWidth = document.getElementById("game-container").offsetWidth;
    const xPosition = Math.random() * (gameWidth - 80);
    drop.style.left = xPosition + "px";
    drop.style.top = "0px";

    // Set fall animation duration
    drop.style.animationDuration = "3s";

    // Add to game container
    document.getElementById("game-container").appendChild(drop);

    // --- Drop Click/Touch Handler ---
    function handleBlueDropTapOrClick(e) {
        // Prevent double firing on touch devices
        e.preventDefault();
        // Play pop sound
        const popSound = document.getElementById('pop-sound');
        if (popSound) popSound.play();

        // Remove drop and decrease score (if possible)
        drop.remove();
        if (scoreCounter) {
            let currentScore = parseInt(scoreCounter.textContent, 10);
            if (currentScore >= 3) {
                scoreCounter.textContent = currentScore - 3;
                console.log("Score updated:", scoreCounter.textContent);
            }
        }
    }
    drop.addEventListener("click", handleBlueDropTapOrClick);
    drop.addEventListener("touchstart", handleBlueDropTapOrClick, { passive: false });

    // --- Drop Animation End Handler (reaches bottom) ---
    drop.addEventListener("animationend", () => {
        drop.remove();
        let currentScore = parseInt(scoreCounter.textContent, 10);
        if (scoreCounter) {
            scoreCounter.textContent = currentScore + 1;
            console.log("Score updated:", scoreCounter.textContent);
        }

        // Win condition: 100 points
        if (currentScore > 98) {
            // Play win sound
            const winSound = document.getElementById('win-sound');
            if (winSound) winSound.play();

            // Stop game
            clearInterval(blueDropMaker);
            clearInterval(greenDropMaker);
            gameRunning = false;
            console.log("Game over - You won!");

            // Show win screen
            document.getElementById('game-container').classList.add('hidden');
            document.querySelector('.score-lives-container').classList.add('hidden');
            document.querySelector('.level-reset-container').classList.add('hidden');
            document.querySelector('.win-container').classList.remove('hidden');
        }
        console.log("Drop finished falling and was removed");
    });
}

// --- Create Green Drop (Dirty Water) ---
function createGreenDrop() {
    // Create drop element
    const drop = document.createElement("div");
    drop.className = "green-water-drop";

    // Visual variety: random size
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.2 + 0.9;
    const size = initialSize * sizeMultiplier;
    drop.style.width = drop.style.height = `${size}px`;

    // Random horizontal position
    const gameWidth = document.getElementById("game-container").offsetWidth;
    const xPosition = Math.random() * (gameWidth - 60);
    drop.style.left = xPosition + "px";
    drop.style.top = "0px";

    // Set fall animation duration
    drop.style.animationDuration = "3s";

    // Add to game container
    document.getElementById("game-container").appendChild(drop);

    // --- Drop Click/Touch Handler ---
    function handleGreenDropTapOrClick(e) {
        e.preventDefault();
        // Play pop sound
        const popSound = document.getElementById('pop-sound');
        if (popSound) popSound.play();

        // Remove drop (no score/lives change)
        drop.remove();
    }
    drop.addEventListener("click", handleGreenDropTapOrClick);
    drop.addEventListener("touchstart", handleGreenDropTapOrClick, { passive: false });

    // --- Drop Animation End Handler (reaches bottom) ---
    drop.addEventListener("animationend", () => {
        drop.remove();
        if (livesCounter) {
            let currentLives = parseInt(livesCounter.textContent, 10);
            if (currentLives > 0) {
                livesCounter.textContent = currentLives - 1;
                console.log("Lives updated:", livesCounter.textContent);
            }
            // Lose condition: 0 lives
            if (currentLives < 2) {
                // Play lose sound
                const loseSound = document.getElementById('lose-sound');
                if (loseSound) loseSound.play();

                // Stop game
                clearInterval(blueDropMaker);
                clearInterval(greenDropMaker);
                gameRunning = false;
                console.log("Game over - no lives left");

                // Show lose screen
                document.getElementById('game-container').classList.add('hidden');
                document.querySelector('.score-lives-container').classList.add('hidden');
                document.querySelector('.level-reset-container').classList.add('hidden');
                document.querySelector('.lose-container').classList.remove('hidden');
            }
        }
        console.log("Drop finished falling and a life was lost");
    });
}