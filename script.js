const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
var originText = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

var timer = [0, 0, 0]; // minutes, seconds, hundredths
var interval;
var timerRunning = false;
var textArray = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing practice helps improve speed and accuracy.",
    "JavaScript has nothing to do with Java.",
    "Form over weight",
    "Horsepower does not beat weight."
];
var errorCount = 0;
var totalSeconds = timer[0] * 60 + timer[1] + timer[2] / 100;
if (totalSeconds > 0) {
    var wpm = Math.round((testArea.value.length / 5) / (totalSeconds / 60));
    document.getElementById("wpm").textContent = wpm;
}



// Add leading zero to numbers 9 or below (purely for aesthetics):
function addLeadingZero(time) {
    if (time <= 9) {
        time = "0" + time;
    }
    return time;
}
// Run a standard minute/second/hundredths timer:
function runTimer() {
    // increase hundredths
    timer[2] = timer[2] + 1;

    // if hundredths reach 100 → reset and increase seconds
    if (timer[2] == 100) {
        timer[2] = 0;
        timer[1] = timer[1] + 1;
    }

    // if seconds reach 60 → reset and increase minutes
    if (timer[1] == 60) {
        timer[1] = 0;
        timer[0] = timer[0] + 1;
    }

    // display time
    let currentTime =
        addLeadingZero(timer[0]) + ":" +
        addLeadingZero(timer[1]) + ":" +
        addLeadingZero(timer[2]);

    theTimer.textContent = currentTime;
}

// Match the text entered with the provided text on the page:

function textMatch() {
    let textEntered = testArea.value;

    if (textEntered == originText.textContent) {
        clearInterval(interval);
        testWrapper.style.borderColor = "green";

        // save score
        var finalTime = theTimer.textContent;
        saveScore(finalTime);
        displayScores();
    } else {
        // check if correct so far
        if (originText.textContent.indexOf(textEntered) === 0) {
            testWrapper.style.borderColor = "blue";
        } else {
            testWrapper.style.borderColor = "red";
            errorCount++;
            document.getElementById("error-count").textContent = errorCount;
        }
    }
}
// Start the timer:
function start() {
    if (testArea.value.length === 0 && !timerRunning) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0];
    timerRunning = false;

    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = "grey";
    
    errorCount = 0;
    document.getElementById("wpm").textContent = "0";
    document.getElementById("error-count").textContent = "0";
    setRandomText(); 
}
// Event listeners for keyboard input and the reset button:


testArea.addEventListener("keypress", start);
testArea.addEventListener("keyup", textMatch);
resetButton.addEventListener("click", reset);

// Save score function
function saveScore(time) {
    var scores = localStorage.getItem("scores");

    if (scores == null) {
        scores = [];
    } else {
        scores = JSON.parse(scores);
    }

    scores.push(time);

    // sort from fastest to slowest
    scores.sort();

    // keep only top 3
    if (scores.length > 3) {
        scores = scores.slice(0, 3);
    }

    localStorage.setItem("scores", JSON.stringify(scores));
}

function displayScores() {
    var scoreList = document.getElementById("scores");
    scoreList.innerHTML = "";

    var scores = localStorage.getItem("scores");

    if (scores == null) {
        return;
    }

    scores = JSON.parse(scores);

    for (var i = 0; i < scores.length; i++) {
        var li = document.createElement("li");
        li.textContent = scores[i];
        scoreList.appendChild(li);
    }
}
window.onload = function() {
    displayScores();
    setRandomText(); // ← ADD THIS
}

function setRandomText() {
    var randomIndex = Math.floor(Math.random() * textArray.length);
    originText.textContent = textArray[randomIndex];
}