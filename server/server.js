const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the /tension folder
app.use(express.static(path.join(__dirname, "../")));

const RESULTS_FILE = path.join(__dirname, "results.json");

// Load existing results or create an empty file if not found
let results = [];
if (fs.existsSync(RESULTS_FILE)) {
    results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
}

// Save user results
app.post("/tension/server/save-results", (req, res) => {
    const { name, email, phone, tensionData } = req.body;

    if (!name || !email || !phone || !Array.isArray(tensionData)) {
        console.error("Missing data in request body");
        return res.status(400).send("Missing data in request body");
    }

    // Load existing results
    let results = [];
    if (fs.existsSync(RESULTS_FILE)) {
        results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
    }

    // Add new result
    results.push({ name, email, phone, tensionData });

    // Save updated results to file
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

    res.sendStatus(200);
});

// Get stored results
app.get("/tension/server/get-results", (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    // Reload the latest data from results.json
    let latestResults = [];
    if (fs.existsSync(RESULTS_FILE)) {
        latestResults = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
    }

    res.json(latestResults);
});

// Get Test results
app.get("/test", (req, res) => {
    res.json({Test:1});
});

// Handle /tension/server/test
app.get('/tension/server/test', (req, res) => {
    res.send('test');
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));