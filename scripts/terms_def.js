let termsBank = {};
let selectedTerms = [];
let currentTerm = {};
let score = 0;
let attemptedQuestions = 0;

console.log("Attempting to fetch:");
fetch("https://sec-plus-game.s3.us-east-1.amazonaws.com/data/terms_definitions.json")
    .then(response => response.json())
    .then(data => { 
        termsBank = data;
        populateCategories(Object.keys(termsBank));
        console.log("Terms bank loaded:", termsBank);
    })
    .catch(error => console.error("Error loading terms bank:", error));

function populateCategories(categories) {
    const categoryDropdown = document.getElementById("category-select");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.textContent = category;
        option.value = category;
        categoryDropdown.appendChild(option);
    });
}

function populateWordBank(selectedTerms) {
    const wordBankList = document.getElementById("word-bank-list");
    wordBankList.innerHTML = ""; // Clear previous list

    selectedTerms.forEach(termObj => {
        const listItem = document.createElement("li");
        listItem.textContent = termObj.term;
        listItem.setAttribute("data-term", termObj.term); // Add data attribute for tracking
        wordBankList.appendChild(listItem);
    });
}

function grayOutTerm(term) {
    const wordBankList = document.getElementById("word-bank-list");
    const items = wordBankList.querySelectorAll("li");

    items.forEach(item => {
        if (item.getAttribute("data-term") === term) {
            item.classList.add("grayed-out"); // Add the "grayed-out" style class
        }
    });
}

document.getElementById("start-game").addEventListener("click", () => {
    const selectedCategory = document.getElementById("category-select").value;
    if (!termsBank[selectedCategory]) {
        alert("Please select a valid category!");
        return;
    }
    selectedTerms = [...termsBank[selectedCategory]]; // Clone the array
    score = 0; // Reset score
    attemptedQuestions = 0; // Reset attempts
    updateGameStatus();
    populateWordBank(selectedTerms); // Populate word bank at game start
    startNewRound();
});

function startNewRound() {
    if (selectedTerms.length === 0) {
        // Calculate the final score
        const percentage = (score / attemptedQuestions) * 100;
        const feedbackMessage = percentage >= 70 ? "Nice Job! This is passing." : "Practice some more and try again later!";
        
        // Display the final score and feedback
        document.getElementById("definition").textContent = `Game Over!`;
        document.getElementById("feedback").textContent = `Your final score: ${score}/${attemptedQuestions} (${percentage.toFixed(2)}%). ${feedbackMessage}`;
        
        document.getElementById("user-input").style.display = "none";
        document.getElementById("submit-answer").style.display = "none";
        return;
    }

    // Select a random term
    const randomIndex = Math.floor(Math.random() * selectedTerms.length);
    currentTerm = selectedTerms[randomIndex];

    // Display the definition
    document.getElementById("definition").textContent = currentTerm.definition;

    // Clear previous input and feedback
    document.getElementById("feedback").textContent = "";
    document.getElementById("user-input").value = "";
}

document.getElementById("submit-answer").addEventListener("click", () => {
    const userAnswer = document.getElementById("user-input").value.trim();

    if (userAnswer.toLowerCase() === currentTerm.term.toLowerCase()) {
        document.getElementById("feedback").textContent = "Correct! Great job!";
        score++;
	console.log("graying out term:", currentTerm.term); //debug log
        grayOutTerm(currentTerm.term); // Gray out the correct term
	
	//remove answerd term from the selectedTerms array
        selectedTerms = selectedTerms.filter(termObj => termObj.term.toLowerCase() !== currentTerm.term.toLowerCase()); // Remove the answered term
    } else {
        document.getElementById("feedback").textContent = `Incorrect. The correct term was: ${currentTerm.term}`;
    }

    attemptedQuestions++;
    updateGameStatus();
    startNewRound();
});

function updateGameStatus() {
    document.getElementById("score").textContent = score;
    document.getElementById("attempted").textContent = attemptedQuestions;
}

