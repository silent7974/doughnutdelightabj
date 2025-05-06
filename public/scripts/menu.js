// Function to get cookie by name
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

// For the large tub menu
const swiper3 = new Swiper('.swiper3', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true, // This makes the fading smooth and cross between images
    },
    autoplay: {
      delay: 5000,
      disableOnIneraction: false, // Allow interaction without stopping autoplay
    },
    speed: 1000, // Animation speed for fading
    loop: true,  
});



// Menu scrolling functionality
function smoothScroll(targetSelector, duration = 1000) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
  
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset; // Target's position relative to the top
    const startPosition = window.pageYOffset; // Current scroll position
    const distance = targetPosition - startPosition;
    let startTime = null;
  
    function animationScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
  
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
  
        window.scrollTo(0, run); // Scroll to the calculated position
  
        if (timeElapsed < duration) {
            requestAnimationFrame(animationScroll); // Continue animation if time is left
        }
    }
  
    // Easing function: Ease In-Out Quad (slow -> fast -> slow)
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
  
    requestAnimationFrame(animationScroll);
  }
  
  // Attach smoothScroll to menu options
  document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', function () {
        const targetSelector = this.getAttribute('data-target');
        if (targetSelector) {
            smoothScroll(targetSelector, 5000); // Customize duration (in milliseconds)
        }
    });
});



// Add to Cart button functionality

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

// Select all menu cards
let menuCards = document.querySelectorAll('.menu-card');

menuCards.forEach((menuCard) => {
    const addToCartButton = menuCard.querySelector('.add-to-cart'); // Add to Cart button
    const counter = menuCard.querySelector('.counter'); // Counter container
    const minusButton = counter.querySelector('.counter-minus'); // Minus (X) button
    const plusButton = counter.querySelector('.counter-plus'); // Plus button

    // Function to add product to cart
    async function addToCart(productId) {
        try {
            const response = await fetch('/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId })
            });
    
            if (!response.ok) {
                throw new Error("Failed to add product to cart");
            }
            
            const data = await response.json();

            // Find the specific product's counter
            const counterValue = document.querySelector(`.counter-value[data-id="${productId}"]`);
            console.log(counterValue);
            if (counterValue) {
                counterValue.innerHTML = data.updatedQuantity; // Update only this product
            }

            if (data.updatedQuantity > 0) {
                minusButton.innerHTML = "-"; // Change 'X' to '-'
            } else {
                const cartButtonContainer = button.closest(".cart-button-container");
                cartButtonContainer.querySelector(".add-to-cart").classList.remove("hidden");
                cartButtonContainer.querySelector(".counter").classList.add("hidden");
            }

            // Fetch updated cart count
            getCart();

            console.log('Product added to cart:', data);
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    }

    // Function to add product to cart
    async function removeFromCart(productId, button) {
        try {
            const response = await fetch('/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId: "<%= user._id %>", productId }),
            });
            
            const data = await response.json();
            console.log("Remove from cart response:", data);

            if (response.ok) {
                const counterValue = button.closest('.counter').querySelector('.counter-value');
    
                if (counterValue) {
                    counterValue.innerHTML = data.updatedQuantity;
                
                    if (data.updatedQuantity > 0) {
                        button.innerHTML = "-"; // Change 'X' to '-'
                    } else {
                        button.innerHTML = "X"; // Ensure it changes to 'X' before hiding
                        setTimeout(() => { // Small delay to ensure the change is visible
                            const cartButtonContainer = button.closest(".cart-button-container");
                            cartButtonContainer.querySelector(".add-to-cart").classList.remove("hidden");
                            cartButtonContainer.querySelector(".counter").classList.add("hidden");
                        }, 100); 
                    }
                }
            } else {
                console.warn("No quantity of this item in the cart to remove."); // Friendly warning
            }

            // Fetch updated cart count
            getCart();

        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

    // Event listener for "Add to Cart" button
    addToCartButton.addEventListener('click', async () => {
        
        addToCartButton.classList.add('hidden'); // Hide Add to Cart button
        counter.classList.remove('hidden'); // Show counter container
    });

    // Event listener for "+" button
    plusButton.addEventListener('click', async () => {
        const productId = menuCard.dataset.productId;
        const userAuthenticated = await isAuthenticated();
        if (!userAuthenticated) {
            alert("You need to sign up or log in first to add items to the cart.");
            return;
        }

        addToCart(productId);
    });

    // Event listener for "-" button
    minusButton.addEventListener('click', async function () {
        const productId = menuCard.dataset.productId;

        removeFromCart(productId, this);

        // Get the counter value after removing item
        const counterValue = menuCard.querySelector(`.counter-value[data-id="${productId}"]`);

        if (counterValue && parseInt(counterValue.innerHTML) === 0) {
            // If counter reaches 0, switch back to "Add to Cart"
            counter.classList.add("hidden");
            addToCartButton.classList.remove("hidden");
        }
    });
});

async function getCart() {
    try {
        const response = await fetch('/items', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Failed to fetch cart items");

        const data = await response.json();

        console.log("API Response:", data);

        // Update the counter values dynamically
        data.items.forEach(item => {
            const counterValue = document.querySelector(`.counter-value[data-id="${item.productId}"]`);
            const cartButtonContainer = counterValue?.closest(".cart-button-container");

            if (counterValue && cartButtonContainer) {
                counterValue.innerHTML = item.quantity;

                const counterElement = cartButtonContainer.querySelector(".counter");
                const addToCartElement = cartButtonContainer.querySelector(".add-to-cart");
                const minusButton = cartButtonContainer.querySelector('.counter-minus');

                if (item.quantity > 0) {
                    counterElement.classList.remove("hidden");
                    addToCartElement.classList.add("hidden");

                    if (item.quantity > 0) {
                        minusButton.innerHTML = "-"; // Show minus when quantity > 1
                    } else {
                        minusButton.innerHTML = "X"; // Show 'X' when quantity === 1
                    }
                } else {
                    counterElement.classList.add("hidden");
                    addToCartElement.classList.remove("hidden");
                }
            }
        });

        const cartIconNumber = document.querySelector('.cart-icon-number');

        if (cartIconNumber) {
            cartIconNumber.textContent = data.totalQuantity || 0; // Prevent undefined
        } else {
            console.warn("cartIconNumber element not found in DOM.");
        }
        
    } catch (error) {
        console.error("Error fetching cart items:", error);
    }
}

// Run this when the page loads
document.addEventListener("DOMContentLoaded", getCart);