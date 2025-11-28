// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Quick Analyze from Home Page
function quickAnalyze() {
    const code = document.getElementById('quickCode').value;
    
    if (!code.trim()) {
        showToast('Please enter some code to analyze');
        return;
    }
    
    // Store code in sessionStorage and redirect
    sessionStorage.setItem('codeToAnalyze', code);
    window.location.href = 'analyze.html';
}