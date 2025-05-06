// Star rating functionality
const stars = document.querySelectorAll('.star-input');
const ratingValue = document.getElementById('rating-value');

stars.forEach(star => {
    star.addEventListener('click', () => {
      ratingValue.value = star.dataset.value;
  
      stars.forEach(s => s.classList.remove('selected'));
      for (let i = 0; i < star.dataset.value; i++) {
        stars[i].classList.add('selected');
      }
    });
});



// Function to check if the user is authenticated
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



// Review form alert messages
const reviewForm = document.getElementById('review-form');

reviewForm.addEventListener('submit', async (e) => {
    const userAuthenticated = await isAuthenticated();
  
    if (!userAuthenticated) {
        alert("Please log in to submit a review!");
        return;
    } alert("Thank you for your review!");
});