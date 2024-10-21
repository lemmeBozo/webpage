// Note the below should all be constant because the values will NEVER change
let track = document.querySelector(".carousel_track");
let slides = Array.from(track.children); // creates an array of image slides from carousel_track

let previous = document.querySelector(".prev");
let next = document.querySelector(".next");

let nav = document.querySelector(".carousel_nav");
let indicatorDots = Array.from(document.querySelectorAll(".carousel_nav .carousel_indicator")); // different ways of grabing an element

let slideWidth = slides[0].getBoundingClientRect().width;

// Arange slides next to one another (overflow will be hidden so you can't actually see it)
slides.forEach((slide, i) => {
    slide.style.left = slideWidth * i + "px";
});

function moveSlide(track, currentSlide, targetSlide) {
    // moves the slide by targetSlide.style.left amount of pxs
    track.style.transform = "translateX(-" + targetSlide.style.left + ")";
    // removs/adds current-slide class to work for the next slide movement
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
}

function moveIndicator(currentIndicator, targetIndicator) {
    currentIndicator.classList.remove("current-slide");
    targetIndicator.classList.add("current-slide");
}

function findTargetSlide() {
    for (i = 0; i < indicatorDots.length; i++) {
        if (indicatorDots[i].classList.contains("current-slide")) {
            return slides[i];
        }
    } 
}

// IF clicked left, move the slide to the left
previous.addEventListener("click", () => {
    // selects slide
    let currentSlide = track.querySelector(".current-slide");
    let prevSlide = currentSlide.previousElementSibling;
    // selects indicators
    let currentIndicator = nav.querySelector(".current-slide");
    let prevIndicator = currentIndicator.previousElementSibling;

    if (prevSlide) {
        moveSlide(track, currentSlide, prevSlide);
        moveIndicator(currentIndicator, prevIndicator);
    }
});

// IF clicked right, move the slide to the right
next.addEventListener("click", (event) => {
    // selects current and next slide
    let currentSlide = track.querySelector(".current-slide");
    let nextSlide = currentSlide.nextElementSibling;
    // select indicators
    let currentIndicator = nav.querySelector(".current-slide");
    let nextIndicator = currentIndicator.nextElementSibling;

    if (nextSlide) {
        moveSlide(track, currentSlide, nextSlide);
        moveIndicator(currentIndicator, nextIndicator);
    }
});

// IF indicators cilcked move the silde to the correct slide 
nav.addEventListener("click", event => {
    let targetDot = event.target;
    if (targetDot.classList.contains("current-slide")) {
        console.log("Slide does not need to move")
    } else if (!targetDot.classList.contains("carousel_nav")) {
        let currentDot = nav.querySelector(".current-slide");

        moveIndicator(currentDot, targetDot)

        let targetSlide = findTargetSlide();
        let currentSlide = track.querySelector(".current-slide");
        if (targetSlide && currentSlide) {
            moveSlide(track, currentSlide, targetSlide);             
        }
    }
})