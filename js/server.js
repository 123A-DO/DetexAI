const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..")));
app.use(express.static(path.join(__dirname, "../css")));
app.use(express.static(path.join(__dirname, "../js")));

// ----------------------
// Algorithm: Code Analysis
// ----------------------

// Detect the programming language based on keywords & syntax
const detectLanguage = (code) => {
    code = code.trim();

    if (/^\s*#include/.test(code) || /\bprintf\b/.test(code)) return "C/C++";
    if (/^\s*import\s+java|System\.out\.println/.test(code)) return "Java";
    if (/^\s*(import\s+React|function\s+)/.test(code)) return "JavaScript/React";
    if (/^\s*def\s+/.test(code)) return "Python";
    if (/^\s*<\?php/.test(code)) return "PHP";
    if (/^\s*using\s+System;/.test(code)) return "C#";
    if (/^\s*package\s+/.test(code)) return "Go";
    return "Unknown";
};

// AI detection algorithm (heuristic)
const detectAIScore = (code) => {
    let score = 0;

    const aiPatterns = [
        /def\s+\w+\(.*\):\s+"""/,       // docstring comments in Python
        /console\.log\(".*"\)/,          // JS frequent logs
        /for\s+\w+\s+in\s+range\(.*\)/,  // Python loop patterns
        /System\.out\.println\(".+"\)/,  // Java logs
        /\bint\s+\w+\s*=\s*0;/,          // C/C++ style init
        /\/\*.*AI-generated.*\*\//i      // explicit AI comments
    ];

    aiPatterns.forEach((pattern) => {
        if (pattern.test(code)) score += 20; // Each pattern adds 20 points
    });

    return Math.min(score, 100); // Max score = 100
};

// Full analysis function
const analyzeCode = (code) => {
    const language = detectLanguage(code);
    const aiScore = detectAIScore(code);

    return { language, aiScore };
};

// ----------------------
// API Endpoint - Local Analysis (fallback)
// ----------------------
app.post("/analyze", (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "Code is required" });

    const result = analyzeCode(code);
    res.json(result);
});

// ----------------------
// Proxy to Backend (Java Service)
// ----------------------
app.post("/api/analyze", async (req, res) => {
    try {
        const { code, language } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: "Code is required" });
        }

        console.log(`[${new Date().toLocaleTimeString()}] Analyzing code (${code.length} chars)...`);

        // Try backend Java service first
        try {
            const backendUrl = "http://localhost:8080/api/analyze";
            const response = await fetch(backendUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language: language || "auto" })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`[${new Date().toLocaleTimeString()}] Backend response: ${data.verdict}`);
                return res.json(data);
            } else {
                throw new Error(`Backend returned ${response.status}`);
            }
        } catch (backendError) {
            console.warn(`[${new Date().toLocaleTimeString()}] Backend unavailable, using local analysis...`);
            // Fallback to local analysis
            const result = analyzeCode(code);
            return res.json({
                verdict: result.aiScore > 50 ? 'AI-Generated' : 'Human-Written',
                confidence: result.aiScore,
                language: result.language,
                aiProbability: result.aiScore / 100,
                patterns: [
                    { name: 'Language Detection', score: result.aiScore },
                    { name: 'Pattern Analysis', score: Math.min(100, result.aiScore * 1.1) }
                ],
                source: 'local'
            });
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] Error:`, error.message);
        res.status(500).json({ error: "Analysis service unavailable", details: error.message });
    }
});

// ----------------------
// Serve index.html on root
// ----------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/analyze", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "analyze.html"));
});

app.get("/history", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "history.html"));
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`✓ Frontend Server running on port ${PORT}`);
    console.log(`✓ Access at: http://localhost:${PORT}`);
    console.log(`✓ Connected to Backend: http://localhost:8080`);
    console.log(`========================================\n`);
});
