/* Starting code refactor */
class Carousel {
    constructor(images) {
        this.images = images;
        this.index = 0;
        this.carouselElement = this.createCarousel();
        this.previousButton = this.carouselElement.querySelector('.prev');
        this.nextButton = this.carouselElement.querySelector('.next');
        this.track = this.carouselElement.querySelector('.track');
        this.indicators = Array.from(this.carouselElement.querySelectorAll('.carousel_indicator'));
        this.addListeners();
        this.observer = null;
        this.interval = null;

        this.setUpObserver();

        this.startX = 0;
        this.currentX = 0;

        this.addSwipeSupport()

    }

    // Creates the carousel and returns the carousel container DOM element
    createCarousel() {
        // Structure of HTML should be as follows
        // carousel-container
        //     carousel-wrapper
        //         previousButton
        //         track
        //              n amount of imgs
        //         nextButton
        //      carousel_nav
        //          n amount of indicators
        // Creating carousel container
        const carouselContainer = document.createElement("div");
        carouselContainer.classList.add("carousel-container");

        // Creates inner wrapper to hold carousel track and buttons
        const carouselWrapper = document.createElement("div");
        carouselWrapper.classList.add("carousel-wrapper");

        // Creating buttons(with imgs) for carousel navigation
        const previousButton = document.createElement("button");
        const nextButton = document.createElement("button");

        const previousImage = document.createElement("img");
        const nextImage = document.createElement("img");

        previousButton.classList.add("prev");
        nextButton.classList.add("next");

        previousImage.src = "icons/arrow-left.svg"; // Left arrow icon
        previousImage.alt = "Previous button";

        nextImage.src = "icons/arrow-right.svg"; // Left arrow icon
        nextImage.alt = "Next button";

        // Creates carousel track (will hold images)
        const track = document.createElement("div");
        track.classList.add("track");

        // Appending images to carousel track
        this.images.forEach( (source, i) => {
            const image = document.createElement("img");
            image.src = source;
            image.alt = `User Image ${i + 1}`;
            track.appendChild(image);
        });

        // Appending buttons and track to the carousel wrapper
        carouselWrapper.appendChild(previousButton);
        carouselWrapper.appendChild(track);
        carouselWrapper.appendChild(nextButton);

        // Creating carousel nav
        const carouselNav = document.createElement("div");
        carouselNav.classList.add("carousel_nav");

        // Creating indicators based on the number of images
        this.images.forEach((_, i) => {
            const indicator = document.createElement("button");
            indicator.classList.add("carousel_indicator");
            if (i == 0) {indicator.classList.add("current-slide");}
            carouselNav.appendChild(indicator);
        });

        // Finish appending elements to carouselContainer
        carouselContainer.appendChild(carouselWrapper);
        carouselContainer.appendChild(carouselNav);
        console.log("Carousel-container has been created");
        return carouselContainer;
    }

    addListeners()  {
        // Previous button listener
        this.previousButton.addEventListener("click", () => {
            this.stopAutoPlay(); // Upon user interaction stop autoplay;
            // if the index is greater than 0, decrement (so we move back a slide), else set to the last index
            this.index = this.index > 0 ? this.index - 1 : this.images.length - 1;
            this.updateCarousel();
            setTimeout(()=>{this.startAutoPlay();},1000);   // starts up the autoplay after 1 sec
        });

        // Next button listener
        this.nextButton.addEventListener("click", () => {
            this.stopAutoPlay(); // Upon user interaction stop autoplay;
            // if our index is less than the total amount of images
            // then we add 1 to go to the next silde
            // otherwise we set index to 0 to go back to the beggining image
            this.index = this.index < this.images.length - 1 ? this.index + 1 : 0
            this.updateCarousel();
            setTimeout(()=>{this.startAutoPlay();},1000); // starts up the auto play after 1 sec
        });

        // Indicator button listener
        this.indicators.forEach( (indicator, i) => {
            indicator.addEventListener("click", () => {
                this.index = i;
                this.updateCarousel();
            });
        });
        
    }

    updateCarousel() {
        const translateX = -this.index * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        this.indicators.forEach (indicator => { // iterates throughout each indicator to remove current-slide class (only one should have it)
            indicator.classList.remove("current-slide");
        });
        this.indicators[this.index].classList.add("current-slide");
    }

    setUpObserver() {
        // Obesrver will execute when 50% or more of the object is in view
        const observerOptions = {threshold: 0.5} 

        this.observer = new IntersectionObserver((entries) => {
            const entry = entries[0]; // There can only be 1 carousel watched per carousel
            if (entry.isIntersecting) { // if carousel is being watched then start autoplay
                this.startAutoPlay();
            } else { // otherwise stop the auto play when not being watched
                this.stopAutoPlay();
            }
        }, observerOptions);
        this.observer.observe(this.carouselElement);
    }

    startAutoPlay() {
        if (!this.interval) {
            this.interval = setInterval(()=> {
                this.index = (this.index < this.images.length - 1) ? this.index + 1 : 0; // Loop to beginning
                this.updateCarousel();
            },2000);
        }
    }
    stopAutoPlay() {
        if (this.interval) { 
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    addSwipeSupport() {
        this.track.addEventListener("touchstart", (e) => {
            this.stopAutoPlay(); // upon user interaction stop autoplay
            this.startX = e.touches[0].clientX; // updates where the user started touching
        },{ passive: false });
        this.track.addEventListener("touchmove", (e) => {
            this.currentX = e.touches[0].clientX; // update the current touch position
        },{ passive: false });
        this.track.addEventListener("touchend", () => {
            const diffX = this.startX - this.currentX;
            if (Math.abs(diffX) > 50) { // if minimum swipe threshold is reached then move (50px)
                if (diffX > 0) {
                    // Swiped left
                    this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
                } else {
                    // Swiped right
                    this.index = this.index > 0 ? this.index - 1 : this.images.length - 1;
                }
                this.updateCarousel();
            }
        },{ passive: false });
    } 
}


document.addEventListener("DOMContentLoaded", () => {
    // After html content has loaded load the JS Content
    const carouselImages = {
        carousel1: [
            "images/image1.png",
            "images/image2.jpg",
            "images/image3.png"
        ],
        carousel2: [
            "images/image6.jpg",
            "images/image7.jpg",
            "images/image8.png"
        ],
        carousel3: [
            "images/images4.jpg",
            "images/image5.jpg",
        ]
    };


    let cssCarousels = Array.from(document.querySelectorAll(".container"));
    cssCarousels.forEach((carousel) => {
        carousel.style.display = "none";
    })

    const postHeadings = Array.from(document.querySelectorAll(".post-heading"));

    Object.keys(carouselImages).forEach((key, i) => {
        if (postHeadings[i]) {  // if the post heading exists insert a carousel after it
            let carousel = new Carousel(carouselImages[key]);
            postHeadings[i].insertAdjacentElement("afterend", carousel.carouselElement);
        }
    });


});