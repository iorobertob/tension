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

    // Dynamically assign question1, question2, ... questionN
    const participantData = {};
    questionnaireAnswers.forEach((answer, index) => {
        participantData[`question${index + 1}`] = answer;
    });

    participantData.mainTensionData = mainTensionData;
    participantData.heardBefore = heardBefore;
    participantData.timestamp = new Date().toISOString();

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

// Serve results as JSON
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