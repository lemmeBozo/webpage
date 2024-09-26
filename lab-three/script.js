let cordinates = {x: 0, y: 0}; // creates an object to hold position of cursor
let positionText = document.getElementsByClassName("cursor-position"); // selects p element
document.addEventListener("mousemove", (event) => { // upon mouse moving outputs position in text to paragraph
    cordinates.x = event.clientX;
    cordinates.y = event.clientY;

    positionText[0].textContent = "X: " + cordinates.x + "  Y: " + cordinates.y;
});


// class for an asetroid that takes in the movement speed of the asteroid
class Asteroid { 
    constructor(dx, dy) {
        this.element = document.createElement("div"); // Creates a div for the asteroid
        this.element.className = "img-container"; // Applies CSS to class
        const img = document.createElement("img"); // Creates a img
        img.src = "images/asteriod.webp"; // Sets the path to point to image
        img.alt = "picture of a asteroid"
        img.style.height = "200px";
        img.style.width = "200px";
        this.element.appendChild(img); // appends img element to div
        document.body.appendChild(this.element); // appends div element to html body

        // Position asteroid randomly within the view of the screen
        this.x = Math.random() * (window.innerWidth - 200); // Subtract image width to keep it in view
        this.y = Math.random() * (window.innerHeight - 200); // Subtract image height to keep it in view

        this.speedY = dy;
        this.speedX = dx;
        
        // Adds event listener that upon mouse enter scales the asteroid
        this.element.addEventListener("mouseenter", () => {
            this.element.style.transform = "scale(1.1)"; // Scale up
        });
        // Adds event listener that upon mouse leave scales down the asteroid
        this.element.addEventListener("mouseleave", () => {
            this.element.style.transform = "scale(1)"; // Scale back down
        });

        // Adds event listener to remove object if clicked
        this.element.addEventListener("click", (event) => {
            console.log(event); // outputs the mousemove event object to the console
            this.element.classList.add("remove");
            
            // Listens for the end of the animation to remove the element
            this.element.addEventListener("animationend", (event) => {
                console.log(event); // outputs the mousemove event object to the console
                this.destroy();
            }, { once: true }); // Ensures the listener is only invoked once
        });
    }

    move() {
        this.x += this.speedX; // changes the poisiton of the asteroid by speedX amount
        this.y += this.speedY; // changes the position of the asteroid by speedY amount

        // if the asteroid hits the wall it will bounce backwards
        if (this.x > window.innerWidth - 210 || this.x < 0) { 
            this.speedX = -this.speedX;
        }
        // if the asteroid hits the wall it will bounce backwards
        if (this.y > window.innerHeight - 210 || this.y < 0) {
            this.speedY = -this.speedY;
        }

        // moves the asteroid
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

    }
    
    destroy() { // whenever this function is called upon it will "destroy the object"
        this.element.remove();
        console.log("Asteroid destroyed");
    }

}

// creates an empty array (will hold n amount of asteroids)
let array = [];

// creates amount amount of asteroids
function createAsteroids(amount) {
    for (let i = 0; i < amount; i++) {
        array[i] = new Asteroid(2,2);
    }
}

// function that allows for the movement of all asteroids in the array array
function moveAllAsteroids() {
    for (let i = 0; i < array.length; i++) {
        array[i].move();
    }
}

createAsteroids(20);


function gameStart() {
    moveAllAsteroids();
}



let begin = setInterval(function() {gameStart()}, 10);


