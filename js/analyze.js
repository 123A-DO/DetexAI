// Check if code was passed from home page
document.addEventListener('DOMContentLoaded', function() {
    const codeFromStorage = sessionStorage.getItem('codeToAnalyze');
    if (codeFromStorage) {
        document.getElementById('codeInput').value = codeFromStorage;
        sessionStorage.removeItem('codeToAnalyze');
    }
});

function analyzeCode() {
    const code = document.getElementById('codeInput').value;
    
    if (!code.trim()) {
        showToast('Please enter some code to analyze');
        return;
    }
    
    // Show loading state
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';
    
    // Simulate analysis (2 seconds)
    setTimeout(() => {
        const result = generateMockResults(code);
        displayResults(result);
    }, 2000);
}

function generateMockResults(code) {
    // Generate mock analysis results
    const isAI = Math.random() > 0.5;
    const confidence = Math.floor(Math.random() * 20) + 75; // 75-95%
    
    return {
        verdict: isAI ? 'AI-Generated' : 'Human-Written',
        confidence: confidence,
        patterns: [
            { name: 'Naming Conventions', score: Math.floor(Math.random() * 30) + 70 },
            { name: 'Code Structure', score: Math.floor(Math.random() * 30) + 70 },
            { name: 'Comment Style', score: Math.floor(Math.random() * 30) + 70 },
            { name: 'Error Handling', score: Math.floor(Math.random() * 30) + 70 }
        ],
        details: {
            'Lines of Code': code.split('\n').length,
            'Language': 'JavaScript',
            'Complexity': 'Medium',
            'Documentation': 'Good'
        }
    };
}

function displayResults(result) {
    // Hide loading, show results
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    // Set verdict
    const verdictBadge = document.getElementById('verdictBadge');
    verdictBadge.textContent = result.verdict;
    verdictBadge.className = 'verdict-badge ' + (result.verdict === 'Human-Written' ? 'human' : 'ai');
    
    // Set confidence
    document.getElementById('confidenceValue').textContent = result.confidence + '%';
    document.getElementById('confidenceBar').style.width = result.confidence + '%';
    
    // Set patterns
    const patternList = document.getElementById('patternList');
    patternList.innerHTML = result.patterns.map(pattern => `
        <div class="pattern-item">
            <span>${pattern.name}</span>
            <span>${pattern.score}%</span>
        </div>
    `).join('');
    
    // Set details
    const detailsGrid = document.getElementById('detailsGrid');
    detailsGrid.innerHTML = Object.entries(result.details).map(([key, value]) => `
        <div class="detail-item">
            <strong>${key}:</strong>
            <span>${value}</span>
        </div>
    `).join('');
    
    // Save to history
    saveToHistory(result);
}

function saveToHistory(result) {
    const history = JSON.parse(localStorage.getItem('analysisHistory')) || [];
    
    history.unshift({
        id: Date.now(),
        language: result.details.Language,
        verdict: result.verdict,
        confidence: result.confidence,
        date: new Date().toISOString().split('T')[0],
        linesOfCode: result.details['Lines of Code']
    });
    
    // Keep only last 20 items
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem('analysisHistory', JSON.stringify(history));
}

function resetAnalysis() {
    document.getElementById('codeInput').value = '';
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

function clearCode() {
    document.getElementById('codeInput').value = '';
}

function exportResults() {
    showToast('Export feature coming soon!');
}
