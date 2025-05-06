document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/auth/profile');
        const data = await response.json();

        if (response.ok) {
            // Get input elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phoneNumber');
            const addressInput = document.getElementById('address');

            // Assign values from database
            nameInput.value = data.name;
            emailInput.value = data.email;
            phoneInput.value = data.phoneNumber || ''; // Avoids "undefined"
            addressInput.value = data.address || '';

            // Store original values in dataset attributes for comparison
            nameInput.dataset.original = data.name;
            emailInput.dataset.original = data.email;
            phoneInput.dataset.original = data.phoneNumber || '';
            addressInput.dataset.original = data.address || '';

            // Check if user has updated within the last month
            if (data.lastUpdated) {
                const lastUpdated = new Date(data.lastUpdated);
                const oneMonthLater = new Date(lastUpdated);
                oneMonthLater.setMonth(lastUpdated.getMonth() + 1);

                if (new Date() < oneMonthLater) {
                    disableSaveButton(oneMonthLater);
                }
            } 
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
});

// Handle form submission
document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input elements again
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phoneNumber");
    const addressInput = document.getElementById("address");
    const errorMessage = document.getElementById("error-message");

    // Compare new values with stored original values
    if (
        nameInput.value.trim() === nameInput.dataset.original &&
        emailInput.value.trim() === emailInput.dataset.original &&
        phoneInput.value.trim() === phoneInput.dataset.original &&
        addressInput.value.trim() === addressInput.dataset.original
    ) {
        alert("No changes detected. Please modify your details before saving.");
        return;
    }

    try {
        const response = await fetch('/api/auth/profile', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                name: nameInput.value,
                email: emailInput.value,
                phoneNumber: phoneInput.value,
                address: addressInput.value
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Profile updated successfully!");
            location.reload(); // Reload page to show new data
        } else {
            errorMessage.innerText = data.message; // Display error message
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
});

// Function to disable Save Changes button
function disableSaveButton(oneMonthLater) {
    const saveButton = document.getElementById("save-changes");
    saveButton.disabled = true;
    saveButton.classList.add("disabled-btn");
    saveButton.innerText = "Profile changes locked until " + oneMonthLater.toDateString();
}

// Totally delete account
document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    
    if (confirmDelete) {
        try {
            const response = await fetch('/api/auth/deleteAccount', { method: 'DELETE' });

            if (response.ok) {
                alert("Your account has been deleted successfully.");
                window.location.href = '/'; // Redirect to home page
            } else {
                const data = await response.json();
                alert(data.error || "Failed to delete account.");
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert("An error occurred. Try again.");
        }
    }
});