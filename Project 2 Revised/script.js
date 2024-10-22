// Checks if javascript has loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Javascript has successfully loaded!");

    // When the dom has loaded (also means js has loaded) then
    const gallery = document.querySelector(".gallery");
    gallery.style.display = "none";


    // First create the carousel
    createCarousel();
    
    // Select carousel container and set display to block
    const carousel = document.querySelector(".carousel");
    carousel.style.display = "block"

    // Upon creating the carousel add the js for the interactible carousel
    const carouselImages = document.querySelector(".carousel-images");
    const images = document.querySelectorAll(".carousel-images img");

    const nav = document.querySelector(".carousel_nav");

    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let index = 0;

    // Function that updates the location of the current image
    function updateCarousel() {
        const translateX = -index * 100; // calculates the translate value
        carouselImages.style.transform = `translateX(${translateX}%)`; // Moves the imgs

        // Update the current slide indicator
        const currentDot = nav.querySelector(".current-slide");
        if (currentDot) {
            currentDot.classList.remove("current-slide");
        }
        nav.children[index].classList.add("current-slide");
    }

    // runs the move function every time prev button is clicked
    prevButton.addEventListener("click", () => {
        if (index > 0) {
            index -= 1;
        } else {
            index = images.length - 1;
        }
        updateCarousel();
    });

    // runs the move function every time next button is clicked
    nextButton.addEventListener("click", () => {
        if (index < images.length - 1) {
            index += 1;
        } else {
            index = 0;
        }
        updateCarousel();
    });

    // handles the move for when indicators are clicked
    nav.addEventListener("click", event => {
        let targetDot = event.target;
        if (targetDot.classList.contains("current-slide")) {
            console.log("Slide does NOT need to move");
        } else if (targetDot.classList.contains("carousel_indicator")) {
            console.log("slide DOES need to move");
            const dots = nav.querySelectorAll(".carousel_indicator");
            index = Array.from(dots).indexOf(targetDot);
            updateCarousel();
        }
    });
});

function createCarousel() {
    // carousel
    const carousel = document.createElement("div");
    carousel.className = "carousel";
    // carousel-images
    const carouselImages = document.createElement("div");
    carouselImages.className = "carousel-images";

    // carousel_nav        
    const carouselNav = document.createElement("div");
    carouselNav.className = "carousel_nav";

    // img * 3
    for (let i = 0; i < 6; i++) { // appends three images to carousel track (i.e. carouselImages)
        // create and append imgs to carouselImages
        const img = document.createElement("img");
        img.src = "images/placeholder.webp";
        img.alt = "placeholder image text";
        carouselImages.appendChild(img);
        
        // create carousel indicators and add them to carousel nav
        const indicator = document.createElement("button");
        indicator.className = "carousel_indicator";
        if (i === 0) {
            indicator.classList.add("current-slide");
        }
        carouselNav.appendChild(indicator);
    }

    // buttons div
    const buttons = document.createElement("div");
    buttons.className = "buttons";
    
    // prev button
    const prevButton = document.createElement("button"); 
    prevButton.className = "prev";
    prevButton.textContent = "Previous";
    
    // next button
    const nextButton = document.createElement("button"); 
    nextButton.className = "next";
    nextButton.textContent = "Next";

    // Appending buttons to buttons-div
    buttons.appendChild(prevButton);
    buttons.appendChild(nextButton);

    // Append all the elements to the carousel
    carousel.appendChild(carouselImages);
    carousel.appendChild(carouselNav);
    carousel.appendChild(buttons);

    // append the carousel to the body
    document.body.appendChild(carousel);

    console.log("Carousel has been created");
};
