/* Array that holds videos */
let videos = ["video-files/see-through.mp4", "video-files/JONES-Kaleidoscope.mp4", "video-files/D(evil)feat-yama.mp4"];
let fallbackVideo = ["video-files/see-through.webm", "video-files/JONES-Kaleidoscope.webm", "video-files/D(evil)feat-yama.webm"];

// only have captions for the first video
let captionName = "captions/caption-one.vtt"

const video = document.getElementById("media-player");
video.autoplay = false; // stops video from auto playing

let currentIndex = 0;

function loadVideo() {
    video.src = videos[currentIndex];
    video.load();
    video.play().catch(error => {
        console.log("Play attempt failed: ", error);
    });
}



// event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const captionButton = document.querySelector(".captions"); 
    if (currentIndex == 0) { // if the first video is playing creates the track element for the video
        let captions = document.createElement("track");
        captions.src = captionName;
        captions.kind = "subtitles";
        captions.srclang = "en";
        captions.label = "English";
        captions.default = true;
        // captions.mode = "hidden"; // litterally doesn't work it just adds a attribute to the class of track and not the html element itself
        video.appendChild(captions);
        const track = video.textTracks[0]; // I hate this this took me so long to figure out
        track.mode = "hidden";
        captionButton.addEventListener("click", () => {
            if (track.mode == "hidden") { // if track is hidding
                track.mode = "showing"; // then show the captions
            } else {track.mode = "hidden"}; // other wise keep hiding the captions
        });
    }
    loadVideo();
});

video.addEventListener("error", () => { // if video loading fails, load fallback video
    video.src = fallbackVideo[currentIndex];
    video.load();
    video.play().catch(error => {
        console.log("Browser does not support video");
    });
});

// Scrubber event listeners
const scrubber = document.getElementById("video-scrubber");

video.addEventListener("loadedmetadata", () => {
    scrubber.max = video.duration;
});

video.addEventListener("timeupdate", () => {
    scrubber.value = video.currentTime;
});

scrubber.addEventListener("input", (event) => {
    video.currentTime = event.target.value;
});

// Speed Scrubber
const speedScrubber = document.getElementById("speed-scrubber");
const speedScrubberDisplay = document.getElementById("speed-scrubber-value");

speedScrubber.addEventListener("input", (event) => {
    video.playbackRate = speedScrubber.value;
    speedScrubberDisplay.textContent = parseFloat(speedScrubber.value).toFixed(1);
});

// Button event listeners
const playButton = document.querySelector(".play");
const rewind = document.querySelector(".rewind");
const skip = document.querySelector(".skip");

playButton.addEventListener("click", () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
});

rewind.addEventListener("click", () => {
    video.currentTime = Math.max(video.currentTime - 5, 0);
});

skip.addEventListener("click", () => {
    video.currentTime = Math.min(video.currentTime + 5, video.duration);
});


const next = document.querySelector(".next");
const prev = document.querySelector(".previous");

next.addEventListener("click", () => {
    const track = document.querySelector("track");
    if (track) {
        track.remove();
    }
    if (currentIndex < 2) {
        currentIndex++;    
        loadVideo();            
    }


});

prev.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;   
        loadVideo();             
    }


});