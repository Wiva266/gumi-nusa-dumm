// = Navbar = //

// Check scrolled nav
const parentNav = document.querySelector(".parent-nav");

window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
        parentNav.classList.add("scrolled");
    } else {
        parentNav.classList.remove("scrolled");
    }
});

// Hiding nav with button
const navbar = document.querySelector("nav");
const navToggleBtn = document.querySelector(".nav-toggle-btn");

let lastScrollY = window.scrollY;
let navFocused = false;

// Burger menu
const burger = document.querySelector(".burger-menu");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
    if (!navFocused) {
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            navbar.style.transform = "translateY(-100%)";
            navToggleBtn.classList.add("show");

            navLinks.classList.remove("show");
            burger.classList.remove("active");
        } else {
            navbar.style.transform = "translateY(0)";
            navToggleBtn.classList.remove("show");
        }
        lastScrollY = window.scrollY;
    }
});

navToggleBtn.addEventListener("click", () => {
    navbar.style.transform = "translateY(0)";
    navToggleBtn.classList.remove("show");
});

burger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    burger.classList.toggle("active");
});


// = Active nav link based on section (Scroll Spy) = //
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-links li a");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {

            navLinksAll.forEach(link => {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `.nav-links a[href="#${entry.target.id}"]`
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }

        }

    });
}, {
    threshold: 0.5
});

sections.forEach(section => {
    observer.observe(section);
});