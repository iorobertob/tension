const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const RESULTS_FILE = path.join(__dirname, "results.json");

// Ensure results.json exists
if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, "[]", "utf8");
    console.log("Created missing results.json");
}

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
        heardBefore: heardBefore,
        timestamp: new Date().toISOString()
    };

    let results = [];
    try {
        const raw = fs.readFileSync(RESULTS_FILE, "utf8");
        results = JSON.parse(raw);
        if (!Array.isArray(results)) {
            console.warn("results.json was not an array. Resetting.");
            results = [];
        }
    } catch (err) {
        console.error("Error reading results.json:", err);
        results = [];
    }

    results.push(participantData);

    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

    res.sendStatus(200);
});

// Get stored results
app.get("/tension/server/get-results", (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    let latestResults = [];
    try {
        const raw = fs.readFileSync(RESULTS_FILE, "utf8");
        latestResults = JSON.parse(raw);
    } catch (err) {
        console.error("Error reading results.json:", err);
        latestResults = [];
    }

    res.json(latestResults);
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));