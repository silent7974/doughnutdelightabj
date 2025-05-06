// Function to increase product in cart
async function addToCart(productId) {
    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId })
        });

        const data = await response.json();

        // Find the specific product's counter
        const counterValue = document.querySelector(`.cart-counter-value[data-id="${productId}"]`);
            console.log(counterValue);
            if (counterValue) {
                counterValue.innerHTML = data.updatedQuantity; // Update only this product
            }

        if (!response.ok) {
            throw new Error("Failed to add product to cart");
        }

        getCart();

        console.log('Product added to cart:', data);
    } catch (error) {
        console.error("Error adding product to cart:", error);
    }
}

// Function to decrease product in cart
async function removeFromCart(productId) {
    try {
        const response = await fetch('/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ userId: "<%= user._id %>", productId }),
        });
        
        const data = await response.json();

        // Find the specific product's counter
        const counterValue = document.querySelector(`.cart-counter-value[data-id="${productId}"]`);
        console.log(counterValue);
        if (counterValue) {
            counterValue.innerHTML = data.updatedQuantity; 

            // If quantity reaches 0, remove the cart item from the DOM
            if (data.updatedQuantity === 0) {
                const cartItem = document.querySelector(`.cart-item[data-item-id="${productId}"]`);
                if (cartItem) cartItem.remove();
            }
        }

        // Check if there are any cart items left
        const remainingCartItems = document.querySelectorAll('.cart-item');
        const emptyCartContainer = document.querySelector('.empty-cart-container');

        if (remainingCartItems.length === 0) {
                location.reload(); 
        }

        getCart();

        console.log("Remove from cart response:", data);

    } catch (error) {
        console.error("Error removing item:", error);
    }
}

// for other cart page functionalities
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

            const subtotalValue = document.querySelector('.subtotal-value');
            if (subtotalValue) subtotalValue.textContent = `₦${data.subtotal.toLocaleString()}`;   

            // Update total price
            const totalValue = document.querySelector('.total-value');
            if (totalValue) totalValue.textContent = `₦${data.totalPrice.toLocaleString()}`;
        });

        const cartItemCount = document.querySelector('.cart-item-count');
        
        if (cartItemCount) {
            cartItemCount.textContent = `${data.totalQuantity || 0} item(s)`;
        } else {
            console.warn("cartItemCount element not found in DOM.");
        }

        
    } catch (error) {
        console.error("Error fetching cart items:", error);
    }
}

// Select all menu cards
let cartCards = document.querySelectorAll('.cart-item');

cartCards.forEach((cartCard) => {
    const counter = cartCard.querySelector('.cart-item-counter');
    const minusButton = counter.querySelector('.cart-counter-minus'); // Minus (X) button
    const plusButton = counter.querySelector('.cart-counter-plus'); // Plus button
    
    // Event listener for plus button
    plusButton.addEventListener('click', async () => {
        const productId = cartCard.dataset.itemId;
        addToCart(productId);
    });

    
    // Event listener for minus button
    minusButton.addEventListener('click', async () => {
        const productId = cartCard.dataset.itemId;
        removeFromCart(productId);
    });
});