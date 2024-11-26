let chartInstance = null;

document.getElementById("cfForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const resultDiv = document.getElementById("result");
    const ctx = document.getElementById("languageChart").getContext("2d");

    resultDiv.textContent = "Fetching data...";
    resultDiv.className = "result";

    try {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error("User not found or API error.");
        }

        const submissions = data.result;
        const languageCount = {};

        submissions.forEach((submission) => {
            const language = submission.programmingLanguage;
            languageCount[language] = (languageCount[language] || 0) + 1;
        });

        const languages = Object.keys(languageCount);
        const counts = Object.values(languageCount);

        // Define 30 colors for the chart
        const colors = [
            "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40", "#e67e22", "#1abc9c",
            "#9b59b6", "#34495e", "#f1c40f", "#e74c3c", "#74b9ff", "#81ecec", "#fab1a0", "#d63031",
            "#00b894", "#00cec9", "#2d3436", "#fdcb6e", "#6c5ce7", "#636e72", "#ff7675", "#55efc4",
            "#0984e3", "#b2bec3", "#fd79a8", "#ffeaa7", "#dfe6e9", "#a29bfe"
        ];

        const dynamicColors = languages.map((_, index) => colors[index % colors.length]);

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "pie",
            data: {
                labels: languages,
                datasets: [
                    {
                        label: "Languages Used",
                        data: counts,
                        backgroundColor: dynamicColors,
                        borderColor: "#ffffff",
                        borderWidth: 1,
                    },
                ],
            },
        });

        const mostUsedLanguage = languages[counts.indexOf(Math.max(...counts))];
        resultDiv.textContent = `Most used language for ${username}: ${mostUsedLanguage}`;
        resultDiv.className = "result success";
    } catch (error) {
        resultDiv.textContent = error.message;
        resultDiv.className = "result error";
    }
});