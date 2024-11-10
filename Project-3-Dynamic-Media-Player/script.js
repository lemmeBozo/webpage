// Song array and index for the songs array
let songs = ["audio-files/Borderline.mp3", "audio-files/Jones.mp3", "audio-files/Monsune.mp3"];
let lyrics = ["lyrics/borderline.txt", "lyrics/kaleidoscope.txt", "lyrics/monsune.txt"];
let index;

// variable that checks if we are scrubbing
let isScrubbing = false;

// shuffle variable
let isShuffled = false;

// array of lyrics
let lyricArray;

// Audio element
const audio = document.querySelector(".audio-player");

// Songs elemnts
let songElements = Array.from(document.querySelectorAll(".song-row"));

// Buttons
const shuffle = document.getElementById("shuffle");
const previous = document.getElementById("previous");
const play = document.getElementById("play");
const next = document.getElementById("next");
const repeat = document.getElementById("repeat");

// music slider
const musicSlider = document.getElementById("music-slider");

// UI element
const start = document.getElementById("0-Quarters");
const quarter = document.getElementById("1-Quarter");
const half = document.getElementById("2-Quarters");
const three_quarters = document.getElementById("3-Quarters");
const end = document.getElementById("4-Quarters");

// Threshold percentages
const THRESHOLDS = {
    START: 0.0000000000000000000001,
    QUARTER: 0.25,
    HALF: 0.5,
    THREE_QUARTERS: 0.75,
    END: 0.999999999 
}

// Tracks which thresholds have been reached
let reachedThresholds = {
    START: false,
    QUARTER: false,
    HALF: false,
    THREE_QUARTERS: false,
    END: false
};

function proccess() {
    const lyricContainer = document.querySelector('.lyrics');
    const lyricsParagraph = document.querySelector('.lyricsP');
    const lyricSpans = Array.from(lyricsParagraph.querySelectorAll('.lyric-line'));
    lyricArray.forEach((line, i) => {
        if (Math.floor(audio.currentTime) == processSeconds(line)) {
            console.log("Lyric " + i + ": should be bold");    
            lyricSpans.forEach((span) => { // for each span remove bolding
                span.style.fontWeight = "";
            });
            lyricSpans[i].style.fontWeight = "bold";
            // after bolding auto scroll to that element
            lyricSpans[i].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });       
}

// function process the lines into array of time codes 
function processLines() {
    // Select the paragraph element containing the lyrics
    const lyricsParagraph = document.querySelector('.lyricsP');

    let copy = lyricsParagraph.cloneNode(true); // creates a copy of the element
    lyricsParagraph.innerHTML = ""; // clears the text of the element
    // so the text can be processed and put into the paragraph after formating

    // Get the inner HTML and split by delimited i.e. comma
    const lines = copy.innerHTML.split(";");
    let timeCodes = [];
    lines.forEach((line, i) => {
        const timeCode = line.trim().split(" "); // Split each line by spaces
        timeCodes.push(timeCode[0]); // Adds words to the main timeCodes array

        const span = document.createElement("span");
        span.classList.add("lyric-line");
        span.dataset.index = i;
        span.innerHTML = line;
        // append the line and add line breaks after each line
        lyricsParagraph.appendChild(span);
        lyricsParagraph.appendChild(document.createElement("br"));
        lyricsParagraph.appendChild(document.createElement("br"));
    });  
    return timeCodes;
}

// takes in a string and process the time in seconds
function processSeconds(line) {
    let array = line.split(":"); // splits the string into an array
    let minutes = parseInt(array[0].replace("[", ""))  * 60;
    let seconds = parseInt(array[1]);
    return minutes + seconds; // returns the time in seconds
}

// Loads a text file into a given html element
function loadTextFileToElement(element, filePath, callBack) {
    fetch(filePath) // sends network request to retrive data at filePath
        .then(response => {
            if (!response.ok) { // if no response i.e. promise failed
                throw new Error("ERROR: Failed to retrieve file"); // throw error
            }
            return response.text(); // otherwise return the response object as text
        })
        .then (data => { // now put the data into innerHTML (NOTE data = response.text())
            element.innerHTML = data
            if(callBack) {callBack();} // if call back is a valid, callback() the function
        }) 
        .catch (error => { // if error was thrown catch it
            console.error(error);   // outputs the error message to the console
            // but looks extra scary
            element.innerHTML = "ERROR: Lyrics were not retrieved"
        })
}

// Formats time into minutes:seconds
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Sets the passed in HTML element display as block for 5 seconds
function displayUI(element) {
    element.style.display = "block";
    setTimeout(()=> { // displays the element for 5 seconds then set display to none
        element.style.display = "none";
    }, 500)
}

// Returns the appropriate threshold value if it has been reached
// IN HINDSIGHT SHOULD HAVE DONE Math.floor(audio.currentTime)
// if it ain't broke don't fix it
function getPlaybackThreshold() {
    const offset = 0.01; // Small offset for precise upper boundary
    if (!isScrubbing) {
        // Normal playback: check thresholds and mark as reached
        if (audio.currentTime >= audio.duration * THRESHOLDS.END 
            && audio.currentTime < audio.duration * (THRESHOLDS.END + offset)
            && reachedThresholds.END === false) {
            
            // Mark END as reached and set other thresholds as reached
            Object.keys(reachedThresholds).forEach((key) => { reachedThresholds[key] = true; });
            return 5;

        } else if (audio.currentTime >= audio.duration * THRESHOLDS.THREE_QUARTERS 
            && audio.currentTime < audio.duration * (THRESHOLDS.THREE_QUARTERS + offset)
            && reachedThresholds.THREE_QUARTERS === false) {
            
            // Mark THREE_QUARTERS as reached and lower thresholds as reached
            reachedThresholds.THREE_QUARTERS = true;
            reachedThresholds.HALF = true;
            reachedThresholds.QUARTER = true;
            reachedThresholds.START = true;
            return 4;

        } else if (audio.currentTime >= audio.duration * THRESHOLDS.HALF 
            && audio.currentTime < audio.duration * (THRESHOLDS.HALF + offset)
            && reachedThresholds.HALF === false) {
            
            // Mark HALF as reached and lower thresholds as reached
            reachedThresholds.HALF = true;
            reachedThresholds.QUARTER = true;
            reachedThresholds.START = true;
            return 3;

        } else if (audio.currentTime >= audio.duration * THRESHOLDS.QUARTER 
            && audio.currentTime < audio.duration * (THRESHOLDS.QUARTER + offset)
            && reachedThresholds.QUARTER === false) {
            
            // Mark QUARTER as reached and START as reached
            reachedThresholds.QUARTER = true;
            reachedThresholds.START = true;
            return 2;

        } else if (audio.currentTime >= audio.duration * THRESHOLDS.START 
            && audio.currentTime < audio.duration * (THRESHOLDS.START + offset)
            && reachedThresholds.START === false) {
            
            reachedThresholds.START = true;
            return 1;
        }        
    } else {
        // While scrubbing: check thresholds without marking them as reached
        if (audio.currentTime >= audio.duration * THRESHOLDS.END 
            && audio.currentTime < audio.duration * (THRESHOLDS.END + offset)) {
            return 5;
        } else if (audio.currentTime >= audio.duration * THRESHOLDS.THREE_QUARTERS 
            && audio.currentTime < audio.duration * (THRESHOLDS.THREE_QUARTERS + offset)) {
            return 4;
        } else if (audio.currentTime >= audio.duration * THRESHOLDS.HALF 
            && audio.currentTime < audio.duration * (THRESHOLDS.HALF + offset)) {
            return 3;
        } else if (audio.currentTime >= audio.duration * THRESHOLDS.QUARTER 
            && audio.currentTime < audio.duration * (THRESHOLDS.QUARTER + offset)) {
            return 2;
        } else if (audio.currentTime >= audio.duration * THRESHOLDS.START 
            && audio.currentTime < audio.duration * (THRESHOLDS.START + offset)) {
            return 1;
        }
    }
}

// Handles the threshold values by calling the displayUI function with the
// appropriate HTML element passed in
function handlePlaybackThresholds() {
    let value = getPlaybackThreshold();
    switch(value) {
        case 1:
            displayUI(start);
            break;
        case 2:
            displayUI(quarter);
            break;
        case 3:
            displayUI(half);
            break;
        case 4:
            displayUI(three_quarters);
            break;
        case 5:
            displayUI(end);
            break;
        default:
            break;
    }
}

// Loads the song into the audio element
function loadSong() {
    audio.src = songs[index];
    audio.load();
    audio.play().catch(error => {
        console.log("Play attempt failed: ", error);
    });
}

// plays the specific song at the index
function loadSpecificSong(index) {
    // returns a array of keys then for each key in keys sets them to false
    // note its technically reachedThreshold[key] = false
    Object.keys(reachedThresholds).forEach(key => {
        reachedThresholds[key] = false;
    })
    audio.src = songs[index];
    audio.load();
    audio.play().catch(error => {
        console.log("Play attempt failed: ", error);
    }); 
    // when a new song is loaded load the proper lyrics
    // and callback lyric after loading lyrics is complete
    // this is done beause the below is a async function
    loadTextFileToElement(document.querySelector(".lyricsP"), lyrics[index], () => {
        lyricArray = processLines(); // Assign result of processLines to lyric
    });
}

// Upon the page being loaded the song will load
document.addEventListener("DOMContentLoaded", ()=> {
    // We will not auto load the song instead the user will select a song from the list

    //loadSong();
});

// upon the time changing for the song it will check if a threshold has been reached
audio.addEventListener("timeupdate", () => {
    // if lyric are not loaded return

    handlePlaybackThresholds();
    musicSlider.value = audio.currentTime;

    // FUNCTION
    let songTime = document.querySelector(".song-time");
    if (!isNaN(audio.duration)) { // if audio duration is a valid number
        songTime.innerHTML = formatTime(audio.currentTime) + "/" + formatTime(audio.duration);
    }
    // FUNCTION END


    // FUNCTION
    proccess();
    // FUNCTION END
    
});

// Adds event listener to songs to play that specific song if clicked on
songElements.forEach((song, i) => {
    song.addEventListener("click", (event) => {
        index = i
        // removes the active class from the previously active song
        songElements.forEach((song) => song.classList.remove("active"));
        // plays the song the user clicked on
        loadSpecificSong(i);
        // adds the active class to the currently active song 
        event.currentTarget.classList.add("active");
    });
}); 


// Music Control event listeners
play.addEventListener("click", ()=>{
    if (audio.paused) { // if audio is paused play it
        audio.play();
    } else {audio.pause()} // otherwise keep it paused
})

// when next button is pressed plays the next song
next.addEventListener("click", () => {
    // Remove "active" from all songs
    songElements.forEach((song) => song.classList.remove("active"));

    if (!isShuffled) { // if shuffle is not on work as normal
        if (index != null) {
            // Increment index and wrap around if it goes out of bounds
            index = (index + 1) % songs.length;
        }        
    } else { // otherwise if shuffle is on  
        while(true) {
            let newIndex = Math.floor(Math.random() * songs.length);    
            if (index != newIndex) {
                index = newIndex;
                break;
            } 
        }

    }
    // Load the next song
    loadSpecificSong(index);    
    // add active to the appropriate element
    songElements[index].classList.add("active");    
});

// when the previous button is pressed plays the previous song
previous.addEventListener("click", () => {
    // Remove "active" from all songs
    songElements.forEach((song) => song.classList.remove("active"));
    if (!isShuffled) { // if shuffle is not on work as normal
        if (index != null) {
            // Increment index and wrap around if it goes out of bounds
            index = (index - 1 + songs.length) % songs.length;   
        }        
    } else {
        while(true) {
            let newIndex = Math.floor(Math.random() * songs.length);    
            if (index != newIndex) {
                index = newIndex;
                break;
            } 
        }
    }
    // Load the next song
    loadSpecificSong(index);    
    // add active to the appropriate element
    songElements[index].classList.add("active");   
});

repeat.addEventListener("click", () => {
    if (audio.loop == true) {
        repeat.style.background = "red";
        audio.loop = false;
    } else {
        audio.loop = true;
        repeat.style.background = "green";
    }
});

shuffle.addEventListener("click", () =>{
    if (!isShuffled) { // if we are not shuffling then shuffle
        isShuffled = true;        
        shuffle.style.background = "green";
    } else {
        isShuffled = false;
        shuffle.style.background = "red";
    }
});


// setting music slider
audio.addEventListener("loadedmetadata", () => {
    musicSlider.max = audio.duration;
});

musicSlider.addEventListener("input", (event) => {
    audio.currentTime = event.target.value;
    // everytime we scrub just reset the reachedTreshold values
    isScrubbing = true;
    console.log(isScrubbing);

    // maybe add something that everytime you scrub through it will 
    // continually display where you are at
    // like say at the start or quarter, mid or end etc...
});

musicSlider.addEventListener("change", () => {
    isScrubbing = false;
    console.log(isScrubbing);
});

