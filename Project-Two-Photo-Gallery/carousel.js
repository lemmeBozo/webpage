/* Code is litterally complete garbage 
    so many reused code
    not enough functions 
    so many things we colud encpasulate into a function

    PLEASE REFACTOR SOON
*/
document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript has successfully loaded!");

    // Easy object that stores all my imgs for each carousel
    const carouselImages = {
        carousel1: [
            "pixel-images/image1.png",
            "pixel-images/image2.jpg",
            "pixel-images/image3.png"
        ],
        carousel2: [
            "pixel-images/image6.jpg",
            "pixel-images/image7.jpg",
            "pixel-images/image8.png"
        ],
        carousel3: [
            "pixel-images/images4.jpg",
            "pixel-images/image5.jpg",
        ]
    };
    

    // Finds ALL Post headings and creates an array from the node list
    const postHeadings = Array.from(document.querySelectorAll(".post-heading"));

    // Stores the index values for each carousel
    let indexs = [];

    // Loop through the carousels and inserts them after the post headings
    Object.keys(carouselImages).forEach((key, i) => {
        if (postHeadings[i]) {  // if the post heading exists insert a carousel after it
            let index = i; 
            insertCarouselAfter(postHeadings[i], carouselImages[key], index);
            indexs[i] = 0;  // sets the index for the associtaed carousel to 0
        }
    });


    let startX = 0; // Track the starting touch position
    let currentX = 0; // Track the current touch position

    function insertCarouselAfter(element, imgArray, index) {
        const carousel = createCarousel(imgArray);
        element.insertAdjacentElement('afterend', carousel);

        const images = carousel.querySelectorAll(".track img");
        addCarouselListeners(carousel, imgArray, index);
    }

    function createCarousel(imgArray) {
        // Create carousel container (holds everything including buttons, track, and indicators)
        const carouselContainer = document.createElement("div");
        carouselContainer.className = "carousel-container";
    
        // Create inner wrapper to hold the track and buttons
        const carouselWrapper = document.createElement("div");
        carouselWrapper.className = "carousel-wrapper"; // New wrapper for buttons and track
    
        // Left button container (for the previous button)
        const prevContainer = document.createElement("div");
        prevContainer.className = "button-container prev-container";
    
        // Create previous button with an image inside
        const prevButton = document.createElement("button");
        prevButton.className = "prev";
        const prevImg = document.createElement("img");
        prevImg.src = "images/arrow-left.svg"; // Left arrow icon
        prevImg.alt = "Previous";
        prevButton.appendChild(prevImg); // Append image to button
        prevContainer.appendChild(prevButton); // Append button to container
    
        // Create carousel track (holds images)
        const track = document.createElement("div");
        track.className = "track";
    


        // Append images to the track
        imgArray.forEach((src, i) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = `Image ${i + 1}`;
            track.appendChild(img); // Append each image to the track
        });
    
        // Right button container (for the next button)
        const nextContainer = document.createElement("div");
        nextContainer.className = "button-container next-container";
    
        // Create next button with an image inside
        const nextButton = document.createElement("button");
        nextButton.className = "next";
        const nextImg = document.createElement("img");
        nextImg.src = "images/arrow-right.svg"; // Right arrow icon
        nextImg.alt = "Next";
        nextButton.appendChild(nextImg); // Append image to button
        nextContainer.appendChild(nextButton); // Append button to container
    
        // Append the buttons and track to the carousel wrapper
        carouselWrapper.appendChild(prevContainer);
        carouselWrapper.appendChild(track);
        carouselWrapper.appendChild(nextContainer);
    
        // Create carousel navigation indicators
        const carouselNav = document.createElement("div");
        carouselNav.className = "carousel_nav";
    
        // Create indicators based on the number of images
        imgArray.forEach((_, i) => {
            const indicator = document.createElement("button");
            indicator.className = "carousel_indicator";
            if (i === 0) indicator.classList.add("current-slide");
            carouselNav.appendChild(indicator); // Append indicator to nav
        });
    
        // Assemble all components inside the carousel container
        carouselContainer.appendChild(carouselWrapper); // Add the wrapper with track and buttons
        carouselContainer.appendChild(carouselNav); // Add the indicators below the carousel
    
        console.log("Carousel-container has been created.");
        return carouselContainer;
    }
    

   // Adds event listeners for carousel buttons and indicators
   // MIGHT REMOVE BUTTONS
    function addCarouselListeners(carousel, images, index) {
        const prevButton = carousel.querySelector(".prev");
        const nextButton = carousel.querySelector(".next");
        const nav = carousel.querySelector(".carousel_nav");
        const track = carousel.querySelector(".track");

        prevButton.addEventListener("click", () => {
            stopAutoPlayIfExists(carousel); // stops autoplay on interaction
            indexs[index] = indexs[index] > 0 ? indexs[index] - 1 : images.length - 1;
            updateCarousel(track, nav, images, index);
            
        });
        
        nextButton.addEventListener("click", () => {
            stopAutoPlayIfExists(carousel)  // stops auto play on interaction
            indexs[index] = indexs[index] < images.length - 1 ? indexs[index] + 1 : 0;  // Increment or wrap to 0 if needed
            updateCarousel(track, nav, images, index);  // Update the carousel display with the new index value
            
        });
        

        nav.addEventListener("click", (event) => {
            stopAutoPlayIfExists(carousel); // stops autoplay on interaction
            const targetDot = event.target;
            if (targetDot.classList.contains("carousel_indicator")) {
                const dots = Array.from(nav.querySelectorAll(".carousel_indicator"));
                indexs[index] = dots.indexOf(targetDot);
                updateCarousel(track, nav, images, index);
            }
        });

        // Add swipe listeners for touch devices
        addSwipeSupport(track, images, nav, index, carousel);
    }

    function updateCarousel(track, nav, images, index) {
        const translateX = -indexs[index] * 100; // Move to the correct image
        console.log(translateX);
        console.log(indexs[index]);
        track.style.transform = `translateX(${translateX}%)`;

        const currentDot = nav.querySelector(".current-slide");
        if (currentDot) {
            currentDot.classList.remove("current-slide");
        }
        nav.children[indexs[index]].classList.add("current-slide");
        console.log("this is running");
    }


    // Adds swip control to move the carousel
    function addSwipeSupport(track, images, nav, index, carousel) {
        track.addEventListener("touchstart", (e) => {
            stopAutoPlayIfExists(carousel); // stops autoplay on interaction
            startX = e.touches[0].clientX; // Store the starting touch position
        });

        track.addEventListener("touchmove", (e) => {
            currentX = e.touches[0].clientX; // Update the current touch position
        });

        track.addEventListener("touchend", () => {
            const diffX = startX - currentX;

            if (Math.abs(diffX) > 50) { // Minimum swipe threshold (50px)
                if (diffX > 0) {
                    // Swiped left
                    indexs[index] = indexs[index] < images.length - 1 ? indexs[index] + 1 : 0;
                } else {
                    // Swiped right
                    indexs[index] = indexs[index] > 0 ? indexs[index] - 1 : images.length - 1;
                }
                updateCarousel(track, nav, images, index);
            }
        });
    }

    // Essentially what the below code is going to do is everytime a certain card is viewed
    // it will run the setInterval in which the gallery will auto play

    const carousels = document.querySelectorAll(".carousel-container");

    // We are using map so we can asign key-value pairs
    // so a card goes with its own setInterval
    // This is done incase multiple cards are within the view
    const intervals = new Map(); 
    
    
    const observer = new IntersectionObserver( (entries) => { 
        entries.forEach((entry) => {    // for each card that is being observed
            const carousel = entry.target;  // stores the current card that is being observed

            if(entry.isIntersecting) {
                // Starts A interval for a card if it isn't already currently being tracked
                if (!intervals.has(carousel)) {
                    const interval = createAutoPlayInterval(carousel);
                    intervals.set(carousel, interval);  // the we stores the interval and the card in our map
                }
            } else { // once the card leaves the vieowport
                console.log("You have stopped watching");

                if (intervals.has(carousel)) {
                    clearInterval(intervals.get(carousel)); // stops the interval
                    intervals.delete(carousel); // deletes the card from the map (so the above code will work) again
                }

            }

        })
    }, {threshold: 0.5});

    // Attach the observer to each card
    carousels.forEach((carousel) => observer.observe(carousel));
    
    // Creates the autoplay interval
    function createAutoPlayInterval(carousel) {
        let interval;
        if (!intervals.has(carousel)) {
            interval = setInterval(()=>{
                const index = Array.from(carousels).indexOf(carousel);  // Get the index of the observed card
                // Array of tracks
                const tracks = Array.from(document.querySelectorAll(".track"));
                // Array of navs
                const navs = Array.from(document.querySelectorAll(".carousel_nav"));
                // Get specific images array for the associtaed card
                const images = Object.values(carouselImages);
                if (indexs[index] < images[index].length  - 1) {
                    indexs[index] += 1
                } else {indexs[index]=0}
                updateCarousel(tracks[index], navs[index], images[index], index);
            },2000);
            intervals.set(carousel, interval);
        }
        return interval
    }

    // Will be added to event listeners to stop auto play if user tries to move sildes
    function stopAutoPlayIfExists(carousel) {
        if (intervals.has(carousel)) {  // if map has the particular carousel user is interacting with
            clearInterval(intervals.get(carousel));
            intervals.delete(carousel);
        }
        setTimeout(() => { // after 1 seconds of no user interaction added interval again
            createAutoPlayInterval(carousel);
        }, 1000);
    }


});
