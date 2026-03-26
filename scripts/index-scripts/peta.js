const container = document.getElementById("map-container");
const title = document.getElementById("map-title");
const emptyText = document.querySelector(".empty-text");

// FUNGSI POTONG JUDUL
function truncateText(text, maxLength){
    if(text.length > maxLength){
        return text.substring(0, maxLength) + "...";
    }
    return text;
}

// DATA BERITA
const regionData = {

    "Kalimantan Barat": [
        { title: "Penebangan hutan liar meningkat", img: "images/dummy-img.jpg", link: "#" },
        { title: "Ekspansi perkebunan sawit", img: "images/dummy-img.jpg", link: "#" },
        { title: "Habitat orangutan terancam", img: "images/dummy-img.jpg", link: "#" },
        { title: "Aktivis lingkungan lakukan protes", img: "images/dummy-img.jpg", link: "#" }
    ],

    "Kalimantan Tengah": [
        { title: "Kebakaran lahan gambut terjadi", img: "images/dummy-img.jpg", link: "#" },
        { title: "Kualitas udara menurun", img: "images/dummy-img.jpg", link: "#" },
        { title: "Program restorasi gambut", img: "images/dummy-img.jpg", link: "#" },
        { title: "Satgas karhutla dikerahkan", img: "images/dummy-img.jpg", link: "#" }
    ],

    "Kalimantan Timur": [
        { title: "Dampak pembangunan IKN", img: "images/dummy-img.jpg", link: "#" },
        { title: "Konservasi orangutan diperkuat", img: "images/dummy-img.jpg", link: "#" },
        { title: "Tambang ilegal ditemukan", img: "images/dummy-img.jpg", link: "#" },
        { title: "Program penghijauan dimulai", img: "images/dummy-img.jpg", link: "#" }
    ],

    "Kalimantan Selatan": [
        { title: "Pencemaran sungai meningkat", img: "images/dummy-img.jpg", link: "#" },
        { title: "Banjir akibat kerusakan hutan", img: "images/dummy-img.jpg", link: "#" },
        { title: "Rehabilitasi hutan dimulai", img: "images/dummy-img.jpg", link: "#" },
        { title: "Komunitas lokal tanam pohon", img: "images/dummy-img.jpg", link: "#" }
    ]
};


// MODE EMPTY
function showEmptySlide(message){

    const slides = document.querySelectorAll(".peta-swiper .swiper-slide");

    slides.forEach((slide, index)=>{

        if(index !== slides.length - 1){
            slide.style.display = "none";
        }else{
            slide.style.display = "flex";
        }

    });

    if(emptyText){
        emptyText.textContent = message;
    }

    petaSwiper.params.slidesPerView = 1;
    petaSwiper.update();
}



// MODE ADA BERITA
function showNewsSlides(data, regionName){

    const slides = document.querySelectorAll(".peta-swiper .swiper-slide");

    slides.forEach((slide, index)=>{

        if(data[index]){

            slide.style.display = "flex";

            const img = slide.querySelector("img");
            const small = slide.querySelector("small");
            const titleSlide = slide.querySelector("h3");
            const link = slide.querySelector("a");

            img.src = data[index].img;
            small.textContent = regionName;

            titleSlide.textContent = truncateText(data[index].title, 22);
            titleSlide.setAttribute("title", data[index].title);

            link.href = data[index].link;

        }else{
            slide.style.display = "none";
        }

    });

    petaSwiper.params.slidesPerView = 3;
    petaSwiper.update();
}



// LOAD DATA SLIDE
function loadRegionSlides(regionName){

    const data = regionData[regionName];

    if(!data){
        showEmptySlide("Belum ada berita lingkungan di wilayah ini.");
        return;
    }

    showNewsSlides(data, regionName);
}



// LOAD SVG MAP
fetch("/images/imgs-map-indonesia/map-indonesia.svg")
.then((res)=>res.text())
.then((data)=>{

    container.innerHTML = data;

    const svg = container.querySelector("svg");

    svg.style.width = "100%";
    svg.style.height = "auto";

    const regions = svg.querySelectorAll("[id][name]");

    regions.forEach((region)=>{

        region.addEventListener("click",()=>{

            regions.forEach((r)=>r.classList.remove("active"));
            region.classList.add("active");

            const provinceName = region.getAttribute("name");

            title.textContent = provinceName;

            title.classList.remove("active");
            void title.offsetWidth;
            title.classList.add("active");

            loadRegionSlides(provinceName);

        });

    });

});

// SWIPER
const petaSwiper = new Swiper(".peta-swiper",{
    // slidesPerView: 1,
    spaceBetween: 10,
    loop: false,

    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 10
        },

        1000: {
            slidesPerView: 2,
            spaceBetween: 12
        },

        1300: {
            slidesPerView: 3,
            spaceBetween: 15
        }
    },

    navigation: {
        nextEl: ".peta-next",
        prevEl: ".peta-prev"
    },

    pagination:{
        el: ".peta-pagination",
        clickable: true
    }
});



// DEFAULT SAAT LOAD
showEmptySlide("Silakan pilih provinsi pada peta untuk melihat berita lingkungan.");
