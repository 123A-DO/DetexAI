let isLoginMode = true;

document.addEventListener('DOMContentLoaded', function() {
    const toggleMode = document.getElementById('toggleMode');
    const form = document.getElementById('loginForm');
    
    // Toggle between login and signup
    toggleMode.addEventListener('click', function(e) {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        
        const formTitle = document.getElementById('formTitle');
        const formSubtitle = document.getElementById('formSubtitle');
        const submitBtn = document.getElementById('submitBtn');
        const toggleText = document.getElementById('toggleText');
        
        if (isLoginMode) {
            formTitle.textContent = 'Welcome Back';
            formSubtitle.textContent = 'Sign in to access your analysis history';
            submitBtn.textContent = 'Sign In';
            toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleMode">Sign up</a>';
        } else {
            formTitle.textContent = 'Create Account';
            formSubtitle.textContent = 'Join thousands of developers using DetextAI';
            submitBtn.textContent = 'Sign Up';
            toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleMode">Sign in</a>';
        }
        
        // Re-attach event listener
        document.getElementById('toggleMode').addEventListener('click', arguments.callee);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showToast('Please fill in all fields');
            return;
        }
        
        // Mock authentication
        if (isLoginMode) {
            showToast('Successfully logged in!');
        } else {
            showToast('Account created successfully!');
        }
        
        // Redirect to history page after 1 second
        setTimeout(() => {
            window.location.href = 'history.html';
        }, 1000);
    });
});