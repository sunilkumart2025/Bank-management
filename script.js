document.getElementById("load-questions").addEventListener("click", async () => {
    const questionsArea = document.getElementById("questions-area");
    questionsArea.innerHTML = ""; // Clear previous content

    try {
        const response = await fetch("questions.json");
        if (!response.ok) throw new Error("Failed to load questions!");

        const questions = await response.json();

        questions.forEach((q, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            // Question text
            const questionText = document.createElement("p");
            questionText.textContent = `${index + 1}. ${q.question}`;
            questionDiv.appendChild(questionText);

            // Options
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

            questionsArea.appendChild(questionDiv);
        });
    } catch (error) {
        questionsArea.textContent = error.message;
    }
});
