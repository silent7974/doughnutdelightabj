document.addEventListener("DOMContentLoaded", function () {

    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");

    // Function to get a cookie by name
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            let [key, value] = cookie.split("=");
            if (key === name) return value;
        }
        return null;
    }

    // Check if user has already accepted cookies
    if (getCookie("cookiesAccepted")) {
        cookieBanner.style.display = "none";
    }

    // Accept cookies
    acceptBtn.addEventListener("click", function () {
        document.cookie = "cookiesAccepted=true; path=/; max-age=" + 60 * 60 * 24 * 30;
        console.log("✅ Cookie set: cookiesAccepted=true");
        cookieBanner.style.display = "none";
    });
});
