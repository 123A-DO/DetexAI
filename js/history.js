;
// Load history on page load
document.addEventListener('DOMContentLoaded', function() {
    const history = JSON.parse(localStorage.getItem('analysisHistory')) || mockHistory;
    
    // Update stats
    const totalAnalyses = history.length;
    const humanWritten = history.filter(h => h.verdict === 'Human-Written').length;
    const aiGenerated = history.filter(h => h.verdict === 'AI-Generated').length;
    
    document.getElementById('totalAnalyses').textContent = totalAnalyses;
    document.getElementById('humanWritten').textContent = humanWritten;
    document.getElementById('aiGenerated').textContent = aiGenerated;
    
    // Display history
    const historyList = document.getElementById('historyList');
    const emptyState = document.getElementById('emptyState');
    
    if (history.length === 0) {
        emptyState.style.display = 'block';
        historyList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        historyList.style.display = 'flex';
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item animate-fade-in">
                <div class="history-verdict ${item.verdict === 'Human-Written' ? 'human' : 'ai'}">
                    ${item.verdict}
                </div>
                <div class="history-details">
                    <h4>${item.language} • ${item.linesOfCode} lines</h4>
                    <p class="history-meta">Confidence: ${item.confidence}% • ${item.date}</p>
                </div>
                <button onclick="deleteHistory(${item.id})" class="btn btn-secondary btn-sm" id="dl">Delete</button>
            </div>
        `).join('');
    }
});

function deleteHistory(id) {
    const history = JSON.parse(localStorage.getItem('analysisHistory')) || mockHistory;
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
    location.reload();
}