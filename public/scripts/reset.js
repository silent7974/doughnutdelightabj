document.getElementById('reset-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = window.location.pathname.split('/').pop();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');

    if (!newPassword || !confirmPassword) {
        alert("Both fields are required.");
        return;
    }

    if (newPassword !== confirmPassword) {
        errorMessage.innerText = "Passwords do not match!";
        return;
    }

    try {
        const response = await fetch(`/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword,confirmPassword })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Password reset successful! Redirecting to login.');
            window.location.href = '/';
        } else {
            errorMessage.innerText = data.message || 'Something went wrong.';
        }
    } catch (error) {
        errorMessage.innerText = 'Server error. Try again later.';
    }
});