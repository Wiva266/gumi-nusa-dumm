// =====================
// DATA SUARA
// =====================
const suaraData = [
    {
        name: "Pandawara Group",
        role: "Aktivis Lingkungan",
        img: "images/pandawara.jpg",
        message: "Masalah sampah bukan cuma tanggung jawab pemerintah, tapi kita semua."
    },
    {
        name: "Nadine Chandrawinata",
        role: "Aktivis Lingkungan",
        img: "images/nadine.jpg",
        message: "Kalau bukan kita yang menjaga laut, lalu siapa lagi?"
    },
    {
        name: "Nicholas Saputra",
        role: "Aktivis Lingkungan",
        img: "images/nicholas.jpg",
        message: "Menjaga alam adalah bagian dari menjaga masa depan kita sendiri."
    },
    {
        name: "Prigi Arisandi",
        role: "Aktivis Lingkungan",
        img: "images/prigi.jpg",
        message: "Sungai yang bersih adalah cerminan dari masyarakat yang peduli."
    },
    {
        name: "Melati Wijsen",
        role: "Aktivis Lingkungan",
        img: "images/melati.jpg",
        message: "Perubahan tidak harus besar, yang penting dimulai."
    }
];


// =====================
// SELECT ELEMENT
// =====================
const wrapper = document.querySelector(".suara-swiper .swiper-wrapper");

const highlightBox = document.querySelector(".highlight-suara-swiper");
const highlightImg = highlightBox.querySelector(".person");
const highlightName = highlightBox.querySelector(".person-name");
const highlightRole = highlightBox.querySelector(".person-role");
const highlightMessage = highlightBox.querySelector(".person-message");


// =====================
// GENERATE SLIDE
// =====================
function generateSlides(){

    wrapper.innerHTML = "";

    suaraData.forEach((data)=>{

        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        slide.innerHTML = `
            <i class="ri-arrow-left-up-line"></i>
            <div>
                <img src="${data.img}" class="person">
                <h3 class="person-name">${data.name}</h3>
                <small class="person-role">${data.role}</small>
            </div>
        `;

        wrapper.appendChild(slide);

    });

}


// =====================
// UPDATE HIGHLIGHT
// =====================
function updateHighlight(index){

    const prevIndex = (index - 1 + suaraData.length) % suaraData.length;
    const data = suaraData[prevIndex];

    highlightBox.classList.add("fade");

    setTimeout(()=>{

        highlightImg.src = data.img;
        highlightName.textContent = data.name;
        highlightRole.textContent = data.role;
        highlightMessage.textContent = data.message;

        highlightBox.classList.remove("fade");

    }, 150);

}


// =====================
// INIT
// =====================
generateSlides();

const suaraSwiper = new Swiper(".suara-swiper", {

    slidesPerView: 3,
    spaceBetween: 15,
    loop: true,

    navigation: {
        nextEl: ".suara-next",
        prevEl: ".suara-prev",
    },

    pagination: {
        el: ".suara-pagination",
        clickable: true,
    },

    breakpoints: {
        // mobile kecil
        0: {
            slidesPerView: 1,
            spaceBetween: 0
        },

        // tablet
        800: {
            slidesPerView: 1,
            spaceBetween: 12
        },

        // desktop besar
        1280: {
            slidesPerView: 2,
            spaceBetween: 15
        },
    },

    on: {
        init(){
            updateHighlight(this.realIndex);
        },
        slideChange(){
            updateHighlight(this.realIndex);
        }
    }

});
