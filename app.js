// List of alphabets A-Z
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

// Variables to track state
let currentIndex = 0;
let startTime = null;
let endTime = null;
let warningSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/946/946-preview.mp3"
);
let successSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3"
);
let startSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3"
);
let warningInterval = null;
let isTestEnded = false;
let isStarted = false;

const alphabetDisplay = document.getElementById("alphabet-display");
const timerElement = document.getElementById("timer");
const resultElement = document.getElementById("result");
const warningElement = document.getElementById("warning");
const restartButton = document.getElementById("restart-button");

// Start the timer
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    if (!isTestEnded) {
      const elapsedTime = Math.round((new Date() - startTime) / 1000);
      timerElement.innerText = `Time Taken: ${elapsedTime} seconds`;
    }
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Handle key presses
function handleKeyPress(event) {
  const keyPressed = event.key.toLowerCase();

  if (isTestEnded) return; // Ignore input if test is ended

  if (keyPressed === alphabet[currentIndex]) {
    // Start timer and play start sound if it's the first key
    if (currentIndex === 0 && !isStarted) {
      startSound.play();
      startTimer();
      isStarted = true;
    }

    // Update display
    alphabetDisplay.innerText = keyPressed.toUpperCase();
    document.getElementById(keyPressed).classList.add("correct");

    // Move to the next letter
    currentIndex++;

    // Check if the sequence is complete
    if (currentIndex === alphabet.length) {
      endTime = new Date();
      const timeTaken = Math.round((endTime - startTime) / 1000); // Time in seconds
      resultElement.innerText = `You completed the sequence in ${timeTaken} seconds!`;
      resultElement.style.display = "block"; // Show result
      alphabetDisplay.innerText = "";
      stopTimer();
      successSound.play();
      isTestEnded = true;
      restartButton.style.display = "block"; // Show restart button
      document.removeEventListener("keydown", handleKeyPress);
    }
  } else {
    // Handle incorrect key press
    warningElement.innerText =
      "Incorrect key pressed. Please press the correct key.";

    // Start or continue warning sound
    if (warningSound.paused) {
      warningSound.play();
    } else {
      warningSound.currentTime = 0;
    }

    // Stop warning sound when the correct key is pressed
    if (warningInterval) {
      clearInterval(warningInterval);
    }
    warningInterval = setInterval(() => {
      if (keyPressed === alphabet[currentIndex]) {
        warningSound.pause();
        warningSound.currentTime = 0;
        warningElement.innerText = "";
        document.getElementById(keyPressed).classList.remove("incorrect");
        clearInterval(warningInterval);
      }
    }, 500);

    // Highlight incorrect button
    document.getElementById(keyPressed).classList.add("incorrect");
  }
}

// Add key buttons to the page
alphabet.forEach((letter) => {
  const button = document.createElement("button");
  button.id = letter;
  button.className = "key-button";
  button.innerText = letter.toUpperCase();
  document.body.appendChild(button);
});

// Attach event listener
document.addEventListener("keydown", handleKeyPress);

// Restart game
restartButton.addEventListener("click", () => {
  location.reload(); // Refresh the page to restart the game
});
