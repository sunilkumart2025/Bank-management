const testUrl = "https://raw.githubusercontent.com/<username>/<repository>/main/tests.json"; // Replace with your actual JSON URL
const contentDiv = document.getElementById("content");
const testTitle = document.getElementById("test-title");
const timerDiv = document.getElementById("time");

// Timer settings
const timeLimit = 120; // Time limit in seconds
let timeRemaining = timeLimit;

// Load test data
async function loadTest() {
  try {
    const response = await fetch(testUrl);
    if (!response.ok) throw new Error("Failed to load test data.");
    const data = await response.json();
    displayTest(data.test);
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

// Display test
function displayTest(test) {
  testTitle.textContent = test.testName;
  const questions = test.questions;
  contentDiv.innerHTML = questions
    .map(
      (q, index) => `
      <div class="question">
        <p>${index + 1}. ${q.question}</p>
        ${q.options
          .map(
            (option) =>
              `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`
          )
          .join("")}
      </div>`
    )
    .join("");

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.onclick = () => checkAnswers(test);
  contentDiv.appendChild(submitButton);

  startTimer();
}

// Check answers and display results
function checkAnswers(test) {
  const questions = test.questions;
  let score = 0;
  contentDiv.innerHTML = questions
    .map((q, index) => {
      const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
      const isCorrect = selectedOption && selectedOption.value === q.answer;
      if (isCorrect) score++;
      return `
        <div class="question ${isCorrect ? "correct" : "incorrect"}">
          <p>${index + 1}. ${q.question}</p>
          <p><strong>Your Answer:</strong> ${
            selectedOption ? selectedOption.value : "No Answer"
          }</p>
          <p><strong>Correct Answer:</strong> ${q.answer}</p>
        </div>`;
    })
    .join("");

  contentDiv.innerHTML += `<h2>Your Score: ${score}/${questions.length}</h2>`;
}

// Start timer
function startTimer() {
  const timerInterval = setInterval(() => {
    timeRemaining--;
    const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, "0");
    const seconds = String(timeRemaining % 60).padStart(2, "0");
    timerDiv.textContent = `Time Left: ${minutes}:${seconds}`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      checkAnswers({ questions: [] });
    }
  }, 1000);
}

// Initialize the app
loadTest();
