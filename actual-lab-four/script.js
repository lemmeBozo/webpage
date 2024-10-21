document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript works");

    const cssGallery = document.querySelector(".css-gallery");
    cssGallery.style.display = "none";

    createJsGallery();
    const jsGallery = document.querySelector(".js-gallery");
    jsGallery.style.display = "block"; // Show JS gallery
})


function createJsGallery() {
    const main = document.querySelector("main");
    
    // Create div.carousel_container 
    const carouselContainer = document.createElement("div");
    carouselContainer.className = "carousel_container js-gallery";
    
    // Create button.carousel_button (prev)
    const prevButton = document.createElement("button");
    prevButton.className = "carousel_button prev";
    
    // Create img (for prev button)
    const prevImg = document.createElement("img");
    prevImg.src = "icons/arrow-left.svg";
    prevImg.alt = "arrow pointing to the left";
    prevButton.appendChild(prevImg);

    // Create div.carousel_track-container
    const carouselTrackContainer = document.createElement("div");
    carouselTrackContainer.className = "carousel_track-container";
    
    // Create ul.carousel_track
    const carouselTrack = document.createElement("ul");
    carouselTrack.className = "carousel_track";
    
    // Create imgs for li (items)
    const images = [
        { src: 'Images/wallhaven-5gveg9.jpg', alt: 'Anime witch girl in a forest' },
        { src: 'Images/wallhaven-5gvkr3.png', alt: 'Anime girl with bunny ears hitting a baseball' },
        { src: 'Images/wallhaven-l8o2op.jpg', alt: 'Anime mage girl in the middle of a flower field' },
        { src: 'Images/wallhaven-vqjyjl.jpg', alt: 'Anime cop girl holding the camera' }
    ];

    images.forEach((image, i) => {
        const slide = document.createElement("li");
        slide.classList.add("carousel_slide");

        if (i === 0) {
            slide.classList.add("current-slide"); // Use add to keep other classes
        }
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.alt;

        slide.appendChild(img);
        carouselTrack.appendChild(slide);
    });

    // Append carouselTrack to carouselTrackContainer
    carouselTrackContainer.appendChild(carouselTrack);

    // Create button.carousel_button (next)
    const nextButton = document.createElement("button");
    nextButton.className = "carousel_button next";
    
    const nextImg = document.createElement("img");
    nextImg.src = "icons/arrow-right.svg";
    nextImg.alt = "arrow pointing to the right";
    nextButton.appendChild(nextImg);

    // Create div.carousel_nav
    const nav = document.createElement("div");
    nav.className = "carousel_nav";
    
    // Create carousel indicators
    images.forEach((_, i) => {
        const carousel_indicator = document.createElement("button");
        carousel_indicator.className = "carousel_indicator";

        if (i === 0) {
            carousel_indicator.classList.add("current-slide");
        }
        nav.appendChild(carousel_indicator); // Append to nav
    });

    // Append everything to the carousel container
    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(carouselTrackContainer); // Use carouselTrackContainer here
    carouselContainer.appendChild(nextButton);
    carouselContainer.appendChild(nav);

    // Append carousel container to main
    main.appendChild(carouselContainer);
}