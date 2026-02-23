// Hero Swiper 초기화
const heroSwiper = new Swiper('.hero-swiper', {
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    speed: 1000,
    allowTouchMove: false
});