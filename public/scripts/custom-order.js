// for additional input fields
function toggleCustomInput(dropdownId, inputId) {
    const dropdown = document.getElementById(dropdownId);
    const input = document.getElementById(inputId);

    if (dropdown.value === "yes") {
        input.style.display = "block"; // Show the input field
    } else {
        input.style.display = "none"; // Hide the input field
        input.value = ""; // Clear the custom input
    }
}


async function isAuthenticated() {
    try {
        const response = await fetch('/api/auth/validateToken', {
            method: 'GET',
            credentials: 'include', // Ensure cookies are sent
        });

        const result = await response.json();
        return response.ok && result.user; // Returns true if user is authenticated
    } catch (error) {
        console.error('Error checking auth state:', error);
        return false;
    }
}

//form submission
const customOrderForm = document.getElementById('cake-form');

customOrderForm.addEventListener('submit', async (e) => {
  const userAuthenticated = await isAuthenticated();

  if (!userAuthenticated) {
    alert("You need to log in or sign up to submit your order!");
    return;
  } alert("Custom order submitted successfully!");
});