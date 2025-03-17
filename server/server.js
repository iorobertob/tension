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
app.post("/save-results", (req, res) => {
    const { name, email, phone, tensionData } = req.body;
    results.push({ name, email, phone, tensionData });
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
    res.sendStatus(200);
});

// Get stored results
app.get("/get-results", (req, res) => {
    res.json(results);
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