const heroImg = document.querySelector(".img-slide-hero");
const swiperWrapper = document.querySelector(".hero-swiper .swiper-wrapper");

const slideDelay = 3000;
const slideSpeed = 3000;
const fadeDuration = slideDelay * 0.3;

const totalSlideTime = slideDelay + slideSpeed;
document.documentElement.style.setProperty("--slide-delay", totalSlideTime + "ms");

const slidesData = [
    { img: "images/dummy-img.jpg" },
    { img: "images/dummy2-img.jpg" },
    { img: "images/dummy3-img.jpg" },
    { img: "images/dummy4-img.jpg" },
    { img: "images/dummy-img.jpg" },
    { img: "images/dummy2-img.jpg" },
    { img: "images/dummy3-img.jpg" },
    { img: "images/dummy4-img.jpg" }
];

slidesData.forEach(slide => {
    const slideEl = document.createElement("div");
    slideEl.classList.add("swiper-slide");

    slideEl.innerHTML = `<img src="${slide.img}" alt="Carousel Hero">`;
    
    swiperWrapper.appendChild(slideEl);
});


// Indicator
const indicatorContainer = document.querySelector(".hero-indicator");

slidesData.forEach((_, i) => {

    const dot = document.createElement("span");

    if (i === 0) dot.classList.add("active");

    indicatorContainer.appendChild(dot);

});

const indicators = indicatorContainer.querySelectorAll("span");

// Hero Image
heroImg.src = slidesData[0].img;
heroImg.style.transition = `opacity ${fadeDuration}ms ease`;

// Swiper
const heroSwiper = new Swiper(".hero-swiper", {

    slidesPerView: 4,
    spaceBetween: 15,
    loop: true,
    allowTouchMove: false,

    autoplay: {
        delay: slideDelay,
        disableOnInteraction: false
    },

    speed: slideSpeed,

    breakpoints: {
        // mobile kecil
        0: {
            slidesPerView: 1.2,
            spaceBetween: 10
        },

        // mobile besar
        480: {
            slidesPerView: 2,
            spaceBetween: 10
        },

        // tablet
        768: {
            slidesPerView: 3,
            spaceBetween: 12
        },

        // desktop besar
        1280: {
            slidesPerView: 4,
            spaceBetween: 15
        }
    },

    on: {
        slideChange: function () {

            const index = this.realIndex;

            heroImg.classList.add("fade-out");

            setTimeout(() => {

                heroImg.src = slidesData[index].img;
                heroImg.classList.remove("fade-out");

            }, fadeDuration);


            // update indicator
            indicators.forEach(dot => {
                dot.classList.remove("active");
            });

            const activeDot = indicators[index];

            // restart animation
            activeDot.classList.remove("active");
            void activeDot.offsetWidth;
            activeDot.classList.add("active");

        }
    }

});
