// script.js

// State variables
let startTime = 0;
let elapsedTime = 0;
let lastLapTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 1;

// DOM Elements
const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

// Helper function to format time manually
function formatTime(timeInMilliseconds) {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const milliseconds = Math.floor((timeInMilliseconds % 1000) / 10);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    const formattedMs = milliseconds.toString().padStart(2, '0');
    const formattedSec = seconds.toString().padStart(2, '0');
    const formattedMin = minutes.toString().padStart(2, '0');

    if (hours > 0) {
        const formattedHrs = hours.toString().padStart(2, '0');
        return `${formattedHrs}:${formattedMin}:${formattedSec}.${formattedMs}`;
    } else {
        return `${formattedMin}:${formattedSec}.${formattedMs}`;
    }
}

// Update the main display
function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
}

// Update button disabled states
function updateButtonStates() {
    if (isRunning) {
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.add('pause');
        lapBtn.disabled = false;
        resetBtn.disabled = true;
    } else {
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('pause');
        lapBtn.disabled = true;
        
        if (elapsedTime > 0) {
            resetBtn.disabled = false;
        } else {
            resetBtn.disabled = true;
        }
    }
}

// Toggle between Start and Pause
function toggleStartPause() {
    if (isRunning) {
        // Pause logic
        clearInterval(timerInterval);
        updateDisplay(); // Capture exact final pause time
        isRunning = false;
    } else {
        // Start logic
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10); // Update every 10ms
        isRunning = true;
    }
    updateButtonStates();
}

// Record a lap
function recordLap() {
    if (isRunning) {
        const currentElapsedTime = elapsedTime;
        const lapDuration = currentElapsedTime - lastLapTime;
        lastLapTime = currentElapsedTime;

        const lapTimeFormatted = formatTime(lapDuration);
        const splitTimeFormatted = formatTime(currentElapsedTime);

        const li = document.createElement('li');

        // Create span for lap number and span for the time
        const lapNumberSpan = document.createElement('span');
        lapNumberSpan.textContent = `Lap ${lapCounter}`;

        const lapTimeSpan = document.createElement('span');
        lapTimeSpan.innerHTML = `${lapTimeFormatted} <span class="split-time">(${splitTimeFormatted})</span>`;

        li.appendChild(lapNumberSpan);
        li.appendChild(lapTimeSpan);

        // Add the new lap to the top of the list
        lapsList.prepend(li);
        lapCounter++;
    }
}

// Reset the stopwatch entirely
function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    lastLapTime = 0;
    lapCounter = 1;

    display.textContent = '00:00.00';
    lapsList.innerHTML = ''; // Clear lap history
    updateButtonStates();
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleStartPause);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetStopwatch);

// Initial call to set button states
updateButtonStates();