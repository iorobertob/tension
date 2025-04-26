const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "../")));

const RESULTS_FILE = path.join(__dirname, "results.json");

// Load existing results or create an empty file
let results = [];
if (fs.existsSync(RESULTS_FILE)) {
    results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
}

// Save user results (new structure)
app.post("/tension/server/save-results", (req, res) => {
    const { questionnaireAnswers, mainTensionData, heardBefore } = req.body;

    if (!Array.isArray(questionnaireAnswers) || !Array.isArray(mainTensionData) || (typeof heardBefore !== "string")) {
        console.error("Invalid or missing data in request body");
        return res.status(400).send("Invalid or missing data in request body");
    }

    // Load existing results again to avoid conflicts
    let results = [];
    if (fs.existsSync(RESULTS_FILE)) {
        results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
    }

    // Add new result
    results.push({ questionnaireAnswers, mainTensionData, heardBefore });

    // Save updated results to file
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

// Test route
app.get("/test", (req, res) => {
    res.json({ test: 1 });
});

// Additional test route for /tension/server/test
app.get("/tension/server/test", (req, res) => {
    res.send("test");
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));