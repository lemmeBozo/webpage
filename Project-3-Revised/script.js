// Defines the paths for songs and lyrics
let songPaths = ["audio-files/Borderline.mp3", "audio-files/Jones.mp3", "audio-files/Monsune.mp3"];
let lyricPaths = ["lyrics/borderline.txt", "lyrics/kaleidoscope.txt", "lyrics/monsune.txt"];

// Index for the current song playing
let index;

// Boolean values to check condition
let isScrubbing = false;
let isShuffled = false;

// Array of time codes for the current lyrics being displayed
let lyricTimeCodes = [];

// Threshold percentages
const THRESHOLDS = {
    START: 0.0000000000000000000001,
    QUARTER: 0.25,
    HALF: 0.5,
    THREE_QUARTERS: 0.75,
    END: 0.999999999 
}

// Boolean values to track if thresholds have been triggered
let thresholdReached = {
    START: false,
    QUARTER: false,
    HALF: false,
    THREE_QUARTERS: false,
    END: false
};

// Interval used for timeout
let debounceTimeout;

// HTML elements
    // audio element
    const audio = document.querySelector(".audio-player");
    console.log(audio);

    // Array of song divs
    let songDivs = Array.from(document.querySelectorAll(".song-row")); // creates an array from the playlist container

    // Element that holds lyrics
    const lyricsParagraph = document.querySelector('.lyricsP');

    // Button elements
    const shuffle = document.getElementById("shuffle");
    const previous = document.getElementById("previous");
    const play = document.getElementById("play");
    const next = document.getElementById("next");
    const repeat = document.getElementById("repeat");

    // Music slider
    const musicSlider = document.getElementById("music-slider");
    // UI element
    const start = document.getElementById("start");
    const early = document.getElementById("early");
    const midway = document.getElementById("midway");
    const late = document.getElementById("late");
    const end = document.getElementById("end");

// FUNCTIONS
// Sets the passed in HTML element display as block for .5 seconds
function displayUI(element) {
    element.style.display = "block";
    setTimeout(()=> { // displays the element for .5 seconds then set display to none
        element.style.display = "none";
    }, 500)
}

// Displays the audio player
function showPlayer() {
    const audioContainer = document.querySelector("#js-audio-player");
    audioContainer.style.display = "block";    
}

// Takes in a string and process the time in seconds
function processSeconds(line) {
    let array = line.split(":"); // splits the string into an array
    let minutes = parseInt(array[0].replace("[", ""))  * 60;
    let seconds = parseInt(array[1]);
    return minutes + seconds; // returns the time in seconds
}

// Formats time into minutes:seconds
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Loads a text file into a given HTML element
function processTextFile(element, filePath, callBack) { // NOTE THIS IS ASYNC FUNCTION 
    fetch(filePath) // Sends a network request to retrieve the data at lyricPath
        .then((response) => {
            if(!response.ok) { // if the response is NOT ok
                throw new Error("ERROR: Failed to retrieve file"); // then throw an error
            }
            // otherwise
            return response.text(); // returns filePath.filetype as plain string
        })
        .then ((data) => { // then set the innerHTML of element to data
            element.innerHTML  = data; 
            if (callBack) {callBack();} // If callBack is valid, call back the function (since function is ASYNC)
                                        // after data has been processed i.e. after element = data
        })
        .catch((error) =>{
            console.error(error);
            element.innerHTML = "ERROR: Lyrics were not retrieved";
        })
}

// Process the data from an element
function processData() {
    lyricTimeCodes = []; // Clear the previous time codes
    let copy = lyricsParagraph.cloneNode(true); // Creates a copy of the element
    lyricsParagraph.innerHTML = ""; // Sets the text to nothing, for data processing
    
    const lines = copy.innerHTML.split(";"); // Splits the text from lyricsParagraph into an array of strings
                                            // split by the delimiter ;
    lines.forEach((line, i) => {
        const timeCode = line.trim().split(" "); // Splits each line by spaces
        lyricTimeCodes.push(timeCode[0]); 

        const span = document.createElement("span");
        span.classList.add("lyric-line");
        // span.dataset.index = i might not be necessary
        
        // sets the innerHTML of the lyric span equal to the current line
        span.innerHTML = line;

        // appends the elements to the page and adds line breaks
        lyricsParagraph.appendChild(span);
        lyricsParagraph.appendChild(document.createElement("br"));
        lyricsParagraph.appendChild(document.createElement("br"));

    });

}

// Loads the song at the index
function loadSong(index) {
    // When a new song is loaded thresholds are reset
    resetThresholdFlags();

    audio.src = songPaths[index];
    audio.load();
    audio.play().catch( (error) => {
        console.error(error);
    });

    // loads the proper lyric text
    processTextFile(lyricsParagraph, lyricPaths[index], processData);
}

// adds event listeners for the buttnons
function addButtonListeners() {
    // When previous button is clicked plays the previous song
    previous.addEventListener("click", () => {
        // Remove "active" from all songs
        songDivs.forEach((song) => song.classList.remove("active"));
        if (!isShuffled) { // if shuffle is not on work as normal
            if (index != null) {
                // Increment index and wrap around if it goes out of bounds
                index = (index - 1 + songPaths.length) % songPaths.length;   
            }        
        } else {
            while(true) {
                let newIndex = Math.floor(Math.random() * songPaths.length);    
                if (index != newIndex) {
                    index = newIndex;
                    break;
                } 
            }
        }
        // Load the next song
        loadSong(index);    
        // add active to the appropriate element
        songDivs[index].classList.add("active");       
    });

    // when next button is pressed plays the next song
    next.addEventListener("click", () => {
        // Remove "active" from all songs
        songDivs.forEach((song) => song.classList.remove("active"));

        if (!isShuffled) { // if shuffle is not on work as normal
            if (index != null) {
                // Increment index and wrap around if it goes out of bounds
                index = (index + 1) % songPaths.length;
            }        
        } else { // otherwise if shuffle is on  
            while(true) {
                let newIndex = Math.floor(Math.random() * songPaths.length);    
                if (index != newIndex) {
                    index = newIndex;
                    break;
                } 
            }

        }
        // Load the next song
        loadSong(index);    
        // add active to the appropriate element
        songDivs[index].classList.add("active");    
    });
    // Music Control event listeners
    play.addEventListener("click", ()=>{
        if (audio.paused) { // if audio is paused play it
            audio.play();
        } else {audio.pause()} // otherwise keep it paused
    })

    // Enable repeating of songs
    repeat.addEventListener("click", () => {
        if (audio.loop == true) {
            repeat.style.background = "red";
            audio.loop = false;
        } else {
            audio.loop = true;
            repeat.style.background = "green";
        }
    });
    
    // Shuffles the playlist when clicked
    shuffle.addEventListener("click", () =>{
        if (!isShuffled) { // if we are not shuffling then shuffle
            isShuffled = true;        
            shuffle.style.background = "green";
        } else {
            isShuffled = false;
            shuffle.style.background = "red";
        }
    });
}

// Adds event listener to each div to play the specific song clicked on
function addSongListeners() {
    songDivs.forEach((div, i) => { // for each div in div array, add event listener
        div.addEventListener("click", (event) => {
            // First search for any active songs and remove the class
            songDivs.forEach((div) => {div.classList.remove("active");});
            // Set index equal to the n'th div clicked on
            index = i
            // Play the song the user clicked on
            loadSong(index); // loads the song at the index
            songDivs[index].classList.add("active")
        });
    });
}
// Reset flags when needed (i.e. on song change or user scrubbing)
function resetThresholdFlags() {
    thresholdReached = {
        START: false,
        QUARTER: false,
        HALF: false,
        THREE_QUARTERS: false,
        END: false
    };
}

// Debounced threshold reset function (limits the rate at which the thershold can ring true)
function resetThresholdFlagsDebounced() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        resetThresholdFlags();
    }, 100); 
}

// Returns the threshold value to later be used in handle function
function getPlaybackThreshold() {
    if (!thresholdReached.END && Math.floor(audio.currentTime) === Math.floor(audio.duration * THRESHOLDS.END)) {
        thresholdReached.END = true; // Set flag to prevent repeated triggering
        return 5;
    } else if (!thresholdReached.THREE_QUARTERS && Math.floor(audio.currentTime) === Math.floor(audio.duration * THRESHOLDS.THREE_QUARTERS)) {
        thresholdReached.THREE_QUARTERS = true;
        return 4;
    } else if (!thresholdReached.HALF && Math.floor(audio.currentTime) === Math.floor(audio.duration * THRESHOLDS.HALF)) {
        thresholdReached.HALF = true;
        return 3;
    } else if (!thresholdReached.QUARTER && Math.floor(audio.currentTime) === Math.floor(audio.duration * THRESHOLDS.QUARTER)) {
        thresholdReached.QUARTER = true;
        return 2;
    } else if (!thresholdReached.START && Math.floor(audio.currentTime) === Math.floor(audio.duration * THRESHOLDS.START)) {
        thresholdReached.START = true;
        return 1;
    }
    return null; // Return null if no threshold is met
}

// Function that will display the appropriate marker
function handlePlaybackThresholds() {
    let value = getPlaybackThreshold();
    switch(value) {
        case 1:
            displayUI(start);
            break;
        case 2:
            displayUI(early);
            break;
        case 3:
            displayUI(midway);
            break;
        case 4:
            displayUI(late);
            break;
        case 5:
            displayUI(end);
            break;
        default:
            break;
    }
}

// Sets the scrubber max size equal to audio.duration
function setScrubberSize() {
    audio.addEventListener("loadedmetadata", () => { // once the metadata of a song has loaded
        // set the scrubber max value equal to audio.duration
        musicSlider.max = audio.duration;
    });
}

// updates innerHTML for the songTime
function updateSongTime() {
    const songTime = document.querySelector(".song-time");
    if (!isNaN(audio.duration)) { // if audio.duration is a valid number
        songTime.innerHTML = formatTime(audio.currentTime) + "/" + formatTime(audio.duration);
    }
}

// deals with cues that are affected by time
function handleTimeUpdates() {
    // When audio time updates, check thresholds and update slider and song time
    audio.addEventListener("timeupdate", () => {
        musicSlider.value = audio.currentTime; // Sets the slider value = to currentTime in song
        updateSongTime(); // updates the current time of the song
        handleTimeCodes();
        handlePlaybackThresholds();
    });
} 

// handels any slider event listeners
function handleSlider() {
    musicSlider.addEventListener("input", (event) => {
        audio.currentTime = event.target.value;
        resetThresholdFlagsDebounced(); // Resets thresholds after a certain time
    });
    musicSlider.addEventListener("change", () => {
        resetThresholdFlags(); // Full reset after certain amount of timse
                                // this prevest flags from going multiple times
    });
}

function handleTimeCodes() {
    const lyricSpans = Array.from(lyricsParagraph.querySelectorAll(".lyric-line"));
    const lyricsContainer = document.querySelector(".lyrics"); 
    lyricTimeCodes.forEach((line, i) => {
        if (Math.floor(audio.currentTime) === processSeconds(line)) { // Compare currentTime, not duration
            lyricSpans.forEach((span) => {
                span.style.fontWeight = ""; // Remove bolding from all spans
            });
            lyricSpans[i].style.fontWeight = "bold"; // Bold the current lyric line
            
            // Auto scrolls the container
            const fixedScrollPosition = lyricSpans[i].offsetTop - 500; 
            lyricsContainer.scrollTo({
                top: fixedScrollPosition,
                behavior: "smooth"
            });
        }
    });
}

// Upon document loading, JS will setup audio player
document.addEventListener("DOMContentLoaded", () =>{
    showPlayer();   // Displays the audio player
    addSongListeners(); // Adds event listeners to song divs
    addButtonListeners(); // Adds event listeners for audio controls
    setScrubberSize(); // Sets the scrubber max size equal to audio.duration
    handleTimeUpdates();
    handleSlider();
});

/* COMMENTS TO SELF
    Naming scheme inconsistent at times, (handleSlider vs sliderListeners)
*/