//slideshow
const swiper = new Swiper('.swiper', {
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  loop: true,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

});


// For the frames 
const swiper2 = new Swiper('.swiper2', {
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