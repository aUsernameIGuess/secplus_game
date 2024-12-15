let termsBank = {};
let selectedTerms = [];
let currentTerm = {};
let score = 0;

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
	selectedTerms = termsBank[selectedCategory];
	startNewRound();
});

function startNewRound() {
	if (selectedTerms.length === 0) {
		alert("No terms available in this category.");
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

	//move to the next question
	setTimeout(() => {
		startNewRound();
	}, 2000);
});
