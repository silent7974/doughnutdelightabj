// for signup,login  and logout modals
document.addEventListener('DOMContentLoaded', () => {
    const authButtons = document.querySelector('.auth-buttons'); // Container for Sign Up and Log In buttons

    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');

    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const email = document.getElementById('reset-email').value;

    const closeSignupModal = document.getElementById('close-signup-modal');
    const closeLoginModal = document.getElementById('close-login-modal');

    // Open modals
    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'flex';
        signupError.style.display = 'none'; // Clear any previous errors
    });

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        loginError.style.display = 'none'; // Clear any previous errors
    });

    // Close modals
    closeSignupModal.addEventListener('click', () => {
        signupModal.style.display = 'none';
    });

    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Close modals when clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) signupModal.style.display = 'none';
        if (e.target === loginModal) loginModal.style.display = 'none';
    });

    // Error elements
    const signupError = document.getElementById('signup-error');
    const loginError = document.getElementById('login-error');
    const errorMessage = document.getElementById('forgot-password-error');
    // Sign Up Form Submission
    document.getElementById('signup-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const signupBtn = document.querySelector('#signup-form button[type="submit"]');
        signupBtn.disabled = true;
        signupBtn.textContent = 'Processing...';

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (!response.ok) {
                // Display error message
                signupError.textContent = result.error || 'An error occurred.';
                signupError.style.display = 'block';
            } else {
                // Success action (e.g., close modal or redirect)
                alert('Sign-Up Successful!');
                signupError.style.display = 'none'; // Hide error
                event.target.reset(); // Clear form
                signupModal.style.display = 'none'; // Close modal

                // **Fetch Updated User Info Immediately**
                await updateAuthState();
            }
        } catch (error) {
            console.error(error);
            signupError.textContent = 'An error occurred. Please try again.';
            signupError.style.display = 'block';
        } finally {
            signupBtn.disabled = false;
            signupBtn.textContent = 'Sign Up';
        }
    });

    // Reset signup errors when users begin to type
    document.querySelectorAll('#signup-form input').forEach(input => {
        input.addEventListener('input', () => {
            signupError.style.display = 'none';
        });
    });


    // Log In Form Submission
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const loginBtn = document.querySelector('#login-form button[type="submit"]');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Processing...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
    
            if (!response.ok) {
                loginError.textContent = result.error || 'An error occurred.';
                loginError.style.display = 'block';
            } else {
                alert('Login Successful!');
                loginError.style.display = 'none'; 
                event.target.reset();
                loginModal.style.display = 'none';

                // **Fetch Updated User Info Immediately**
                await updateAuthState();
                
            }
        } catch (error) {
            console.error(error);
            loginError.textContent = 'An error occurred. Please try again.';
            loginError.style.display = 'block';
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Log In';
        }
    });

    document.querySelectorAll('#login-form input').forEach(input => {
        input.addEventListener('input', () => {
            loginError.style.display = 'none';
        });
    });



    // Open forgot password modal
    document.getElementById('forgot-password-btn').addEventListener('click', () => {
        document.getElementById('forgot-password-modal').style.display = 'block';
    });

    // Close forgot password modal
    document.getElementById('close-forgot-password-modal').addEventListener('click', () => {
        document.getElementById('forgot-password-modal').style.display = 'none';
    });

    // Handle Forgot Password Form Submission
    document.getElementById('forgot-password-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // Get the email from the input field
        const email = document.getElementById('reset-email').value.trim();

        if (!email) {
            errorMessage.innerText = 'Please enter your email.';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Password reset link sent to your email!');
                document.getElementById('forgot-password-modal').style.display = 'none';
            } else {
                errorMessage.innerText = data.message || 'An error occurred.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error(error);
            errorMessage.innerText = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
    });

    document.querySelectorAll('#forgot-password-form').forEach(input => {
        input.addEventListener('input', () => {
            errorMessage.style.display = 'none';
        });
    });



    // for viewing password
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function () {
            const passwordField = this.previousElementSibling;
            passwordField.type = passwordField.type === "password" ? "text" : "password";
        });
    });


    // Log Out Functionality
    function logoutUser() {
        // Call backend to clear session/token (if implemented)
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent with the request
        })

        .then((response) => {
            if (response.ok) {
                alert('Logged out successfully!');

                location.href = '/';

                // Reset the UI
                authButtons.innerHTML = `
                    <button id="signup-btn">Sign Up</button>
                    <button id="login-btn">Log In</button>
                `;

                // Reattach event listeners for the new buttons
                reattachAuthListeners();
                
            } else {
                console.error('Logout failed');
            }
        })
        .catch((error) => console.error('Error logging out:', error));
    }

    // Function to reattach event listeners to newly created buttons
    function reattachAuthListeners() {
        const signupBtn = document.getElementById('signup-btn');
        const loginBtn = document.getElementById('login-btn');

        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                signupModal.style.display = 'flex';
            });
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                loginModal.style.display = 'flex';
            });
        }
    }


    // Check Auth State
    async function checkAuthState() {
        try {

            // Optimistic UI update: Set temporary placeholder UI while waiting for validation
            authButtons.innerHTML = `<span>Loading...</span>`;
            authButtons.style.visibility = "visible"; // Make it visible immediately

            const response = await fetch('/api/auth/validateToken', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });

            const result = await response.json();

            // Check if authentication is false or if user is null
            if (!result.authenticated || !result.user) {
                resetAuthUI();
                return;
            }

            // Get first name (assuming names are space-separated)
            const firstName = result.user.name.split(' ')[0];

            // Update UI if the user is authenticated
            authButtons.innerHTML = `
                    <div class="user-dropdown">
                        <button id="user-menu-btn" class="user-menu-btn">
                            Welcome, <span class="user-first-name">${firstName}</span>
                        </button>
                        <div class="dropdown-content">
                            <div class="profile-header">
                                <img src="/images/favicon.jpg" alt="User Icon" class="profile-icon">
                            </div>
                            <div class="profile-info">
                                <p class="full-name">${result.user.name}</p>
                                <p class="email">${result.user.email}</p>
                                <button id="manage-account-btn">Manage Account</button>
                                <button id="logout-btn">Log Out</button>
                            </div>
                        </div>
                    </div>
                `;

                // Add event listener for dropdown functionality
                document.getElementById('user-menu-btn').addEventListener('click', () => {
                    document.querySelector('.dropdown-content').classList.toggle('show');
                }); 

                // Attach logout event
                document.getElementById('logout-btn').addEventListener('click', () => {
                   logoutUser();
                });

                // Navigate to profile page on Manage Account click
                document.getElementById('manage-account-btn').addEventListener('click', () => {
                    window.location.href = '/profile';
                });

        } catch (error) {
            console.error('Error checking auth state:', error);
            // User is not authenticated, show login/signup buttons
            resetAuthUI();
        }
    }


    //Update auth state
    async function updateAuthState() {
        try {
            const response = await fetch('/api/auth/validateToken', {
                method: 'GET',
                credentials: 'include',  // Ensure cookies are sent
            });

            const result = await response.json();

            if (response.ok && result.user) {
                const firstName = result.user.name.split(' ')[0];
                
                // Replace auth buttons with user-specific UI
                authButtons.innerHTML = `
                <div class="user-dropdown">
                    <button id="user-menu-btn" class="user-menu-btn">
                        Welcome, <span class="user-first-name">${firstName}</span>
                    </button>
                    <div class="dropdown-content">
                        <div class="profile-header">
                            <img src="/images/favicon.jpg" alt="User Icon" class="profile-icon">
                        </div>
                        <div class="profile-info">
                            <p class="full-name">${result.user.name}</p>
                            <p class="email">${result.user.email}</p>
                            <button id="manage-account-btn">Manage Account</button>
                            <button id="logout-btn">Log Out</button>
                        </div>
                    </div>
                </div>
                `;
                
                // Add dropdown toggle event
                document.getElementById('user-menu-btn').addEventListener('click', () => {
                    document.querySelector('.dropdown-content').classList.toggle('show');
                });

                // Add Log Out functionality
                document.getElementById('logout-btn').addEventListener('click', () => {
                    logoutUser();
                });

                // Navigate to profile page on Manage Account click
                document.getElementById('manage-account-btn').addEventListener('click', () => {
                    window.location.href = '/profile';
                });
            }
        } catch (error) {
            console.error('Error updating auth state:', error);
        }
    }


    // Function to reset the UI for unauthenticated users
    function resetAuthUI() {
    authButtons.innerHTML = `
        <button id="signup-btn">Sign Up</button>
        <button id="login-btn">Log In</button>
    `;
    reattachAuthListeners();
    }

    // Run the function on page load
    window.addEventListener('DOMContentLoaded', () =>{
        checkAuthState();
    });

    // Run this check when the profile page loads
    if (window.location.pathname === '/profile') {
        checkAuthState();
    }

});