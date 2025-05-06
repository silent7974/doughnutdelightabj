// Paystack functionality
document.addEventListener("DOMContentLoaded", function () {
    const payButton = document.querySelector(".checkout-button");

    if (payButton) {
        payButton.addEventListener("click", payWithPaystack);
    }

    function payWithPaystack() {
        let handler = PaystackPop.setup({
            key: "pk_test_74b7fdec34d01be617a127326120fd488115f699",
            email: document.querySelector("#user-email").value, // Get email dynamically
            amount: parseInt(document.querySelector("#overall-total").innerText.replace("₦", "").trim()) * 100, // Convert to kobo
            currency: "NGN",
            ref: "ORD-" + Math.floor(Math.random() * 1000000000), // Unique reference ID
            callback: function (response) {
                alert("Payment successful! Reference: " + response.reference);

                // Send request to backend to clear the cart
                fetch("/payment/clear-cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reference: response.reference,
                    }),
                })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data.success) {
                        // Redirect to a payment success page
                        window.location.href = "/payment-success?reference=" + response.reference;
                    } else {
                        alert("Failed to clear cart. Please contact support.");
                    }
                })
                .catch((err) => {
                    console.error("Error clearing cart:", err);
                    alert("An error occurred while clearing the cart.");
                });

            },
            onClose: function () {
                alert("Payment window closed.");
            }
        });

        handler.openIframe();
    }
});



// Map functionality

// Initialize the map
const map = L.map("map").setView([9.085121, 7.419830], 13); // Centered on store location

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Add marker (default hidden)
var marker = L.marker([0, 0], { draggable: true }).addTo(map);
marker.setOpacity(0); // Hide marker initially

// Add Geocoder (Search Bar)
L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function (e) {
    var latlng = e.geocode.center;
    map.setView(latlng, 15);
    marker.setLatLng(latlng).setOpacity(1); // Show marker
    document.getElementById('latitude').value = latlng.lat;
    document.getElementById('longitude').value = latlng.lng;
    document.getElementById('address').value = e.geocode.name;
})
.addTo(map);

// Handle manual marker movement
marker.on('dragend', function (e) {
    var latlng = marker.getLatLng();
    document.getElementById('latitude').value = latlng.lat;
    document.getElementById('longitude').value = latlng.lng;
});

// Define store location
const storeLat = 9.085121;
const storeLon = 7.419830;

// Define custom marker icon
const greenIcon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png", 
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon that corresponds to the marker's location
    popupAnchor: [1, -34] // Point from which the popup should open relative to the iconAnchor
});

// Add store marker
const storeMarker = L.marker([storeLat, storeLon], { icon: greenIcon }).addTo(map);
storeMarker.bindPopup("Our Store Location").openPopup();

let userMarker;
let routeLayer; // Store the route layer

// For the delivery calculation button
document.getElementById("confirm-location").addEventListener("click", async () => {
    const lat = document.getElementById("latitude").value;
    const lon = document.getElementById("longitude").value;
    const address = document.getElementById("address").value;
    const cartTotal = parseInt(document.getElementById("cart-total").innerText.replace("₦", "")); // Extracts the cart total

    if (!lat || !lon || !address) {
        alert("Please select a valid location.");
        return;
    }

    // Fetch delivery cost
    fetch("/get-delivery-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon, address }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("delivery-cost").innerText = `₦${data.deliveryCost}`;
        document.getElementById("overall-total").innerText = `₦${parseInt(data.deliveryCost) + parseInt(cartTotal)}`;


        // For the route layers

        // Remove previous route if it exists
        if (routeLayer) {
            map.removeLayer(routeLayer);
        }

        // Fetch route from OpenStreetMap API (OSRM)
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${storeLon},${storeLat};${lon},${lat}?overview=full&geometries=geojson`;

        fetch(routeUrl)
            .then(response => response.json())
            .then(routeData => {
                if (routeData.routes && routeData.routes.length > 0) {
                    const routeCoordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    
                    // Draw new polyline on map
                    routeLayer = L.polyline(routeCoordinates, { color: "blue", weight: 5 }).addTo(map);
                    
                    // Adjust the view to fit the route
                    map.fitBounds(routeLayer.getBounds());
                } else {
                    console.error("No route found.");
                }
            })
            .catch(error => console.error("Error fetching route:", error));
    })
    .catch(error => console.error("Error:", error));
});



// Listen for manual address input and fetch coordinates
document.getElementById("address").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const address = this.value;
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const newLat = data[0].lat;
                    const newLon = data[0].lon;

                    // Update latitude and longitude fields
                    document.getElementById("latitude").value = newLat;
                    document.getElementById("longitude").value = newLon;
                    
                    // Remove previous user marker if it exists
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }
                    
                    // Add new user marker
                    userMarker = L.marker([newLat, newLon]).addTo(map).bindPopup("Selected Location").openPopup();
                    
                    // Center map on new location
                    map.setView([newLat, newLon], 15);
                } else {
                    alert("Address not found. Please enter a valid address.");
                }
            })
            .catch(error => console.error("Error fetching coordinates:", error));
    }
});



// For an autocomplete for the address input
document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const suggestionsContainer = document.createElement("ul");
    suggestionsContainer.classList.add("suggestions-container");
    addressInput.parentNode.appendChild(suggestionsContainer);

    addressInput.addEventListener("input", async function () {
        const query = addressInput.value.trim();
        if (query.length < 3) {
            suggestionsContainer.innerHTML = "";
            return;
        }

        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();
        
        suggestionsContainer.innerHTML = "";
        data.forEach(place => {
            const li = document.createElement("li");
            li.textContent = place.display_name;
            li.addEventListener("click", function () {
                addressInput.value = place.display_name;
                latitudeInput.value = place.lat;
                longitudeInput.value = place.lon;
                suggestionsContainer.innerHTML = "";
                
                // Update map with selected location
                const latlng = [parseFloat(place.lat), parseFloat(place.lon)];
                map.setView(latlng, 15);
                if (userMarker) {
                    map.removeLayer(userMarker); // Remove old marker
                }
                userMarker = L.marker(latlng).addTo(map);
            });
            suggestionsContainer.appendChild(li);
        });
    });

    document.addEventListener("click", function (e) {
        if (!addressInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.innerHTML = "";
        }
    });
});