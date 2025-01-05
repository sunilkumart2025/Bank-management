document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject");
    const test = params.get("test");

    const title = document.getElementById("test-title");
    const container = document.getElementById("questions-container");

    title.textContent = `${subject.toUpperCase()} - ${test.toUpperCase()}`;

    fetch('questions.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to load questions!");
            }
            return response.json();
        })
        .then((data) => {
            const questions = data[subject]?.[test];
            if (!questions) {
                throw new Error("Questions not found!");
            }

            container.innerHTML = ""; // Clear loading text

            questions.forEach((q, index) => {
                const questionDiv = document.createElement("div");
                questionDiv.classList.add("question");

                const questionText = document.createElement("p");
                questionText.textContent = `${index + 1}. ${q.question}`;
                questionDiv.appendChild(questionText);

                q.options.forEach((option) => {
                    const optionDiv = document.createElement("div");
                    optionDiv.classList.add("option");

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = `question-${index}`;
                    radio.value = option;

                    const label = document.createElement("label");
                    label.textContent = option;

                    optionDiv.appendChild(radio);
                    optionDiv.appendChild(label);
                    questionDiv.appendChild(optionDiv);
                });

                container.appendChild(questionDiv);
            });
        })
        .catch((error) => {
            container.innerHTML = `<p class="error">${error.message}</p>`;
        });
});
