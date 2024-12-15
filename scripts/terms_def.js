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

document.getElementById("start-game").addEventListener("click", () => {
	const selectedCategory = document.getElementById("category-select").value;
	if (!termsBank[selectedCategory]) {
		alert("Please select a valid category!");
		return;
	}
	selectedTerms = [...termsBank[selectedCategory]]; //clone the array`
	score = 0 //reset score
	attemptedQuestions = 0; //reset attempts
	updateGameStatus();
	startNewRound();
});

function startNewRound() {
	if (selectedTerms.length === 0) {
		// calculating the final score
		const percentage = (score / attemptedQuestions) * 100;
		const feedbackMessage = percentage >= 70 ? "Nice Job! This is passing" : "Practice some more and try again later!";

		//display the final score and feedback
		document.getElementById("definition").textContent = `Game Over!`;
		document.getElementById("feedback").textContent = `Your final score: ${score}/${attemptedQuestions} (${percentage.toFixed(2)}%). ${feedbackMessage}`;
		
		document.getElementById("user-input").style.display = "none";
		document.getElementById("submit-answer").style.display = "none";

		return;
	}

	// Selct a random term
	const randomIndex = Math.floor(Math.random() * selectedTerms.length);
	currentTerm = selectedTerms[randomIndex];

	//display the def
	document.getElementById("definition").textContent = currentTerm.definition;
	
	//Clear previous input and feedback`
	document.getElementById("feedback").textContent = "";
	document.getElementById("user-input").value = "";

	//remove term from array to aviod repetiion
	selectedTerms.splice(randomIndex, 1);
}

document.getElementById("submit-answer").addEventListener("click", () => {
	const userAnswer = document.getElementById("user-input").value.trim();

	if (userAnswer.toLowerCase() === currentTerm.term.toLowerCase()) {
		document.getElementById("feedback").textContent = "Correct! Great job!";
		score++;
	} else {
		document.getElementById("feedback").textContent = `Incorrect. The correct term was: ${currentTerm.term}`;
	}
	
	attemptedQuestions++;
	
	updateGameStatus();
	removeAnsweredTerm();
	startNewRound();
});

function updateGameStatus() {
	document.getElementById("score").textContent = score;
	document.getElementById("attempted").textContent = attemptedQuestions;
}

function removeAnsweredTerm() {
	selectedTerms = selectedTerms.filter(term => term.term !== currentTerm.term);
}
