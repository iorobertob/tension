const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "../")));

const RESULTS_FILE = path.join(__dirname, "results.json");

// Save user results
app.post("/tension/server/save-results", (req, res) => {
    const { questionnaireAnswers, mainTensionData, heardBefore } = req.body;

    if (!Array.isArray(questionnaireAnswers) || !Array.isArray(mainTensionData) || typeof heardBefore !== "string") {
        console.error("Invalid or missing data in request body");
        return res.status(400).send("Invalid or missing data in request body");
    }

    if (questionnaireAnswers.length !== 8) {
        console.error("Questionnaire must have exactly 8 answers");
        return res.status(400).send("Questionnaire must have exactly 8 answers");
    }

    // Create structured object
    const participantData = {
        question1: questionnaireAnswers[0],
        question2: questionnaireAnswers[1],
        question3: questionnaireAnswers[2],
        question4: questionnaireAnswers[3],
        question5: questionnaireAnswers[4],
        question6: questionnaireAnswers[5],
        question7: questionnaireAnswers[6],
        question8: questionnaireAnswers[7],
        mainTensionData: mainTensionData,
        heardBefore: heardBefore
    };

    // Load current results
    let results = [];
    if (fs.existsSync(RESULTS_FILE)) {
        results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
    }

    // Add new result
    results.push(participantData);

    // Save updated results
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

    res.sendStatus(200);
});

// Get stored results
app.get("/tension/server/get-results", (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    let latestResults = [];
    if (fs.existsSync(RESULTS_FILE)) {
        latestResults = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
    }

    res.json(latestResults);
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));