// Displays initial local storage values to the screen if any
displayLocalStorage(localStorage.getItem("search"));

// API Key (HIDE THIS LATER)
const API_KEY = "TSYG1xjK9P1Pzej0W7UhbtV9qbvtaC7d693lME1Y";


// HTML elements
const form = document.getElementById("search-form");
let clearButton = document.querySelector(".clear");

function displaySources(sources, entry) {  
    console.log(sources);
    if (Object.keys(sources).length > 0) {
        const sourcesDiv = document.createElement("div");
        sourcesDiv.classList.add("sources-container");
        sources.forEach((source) => {
            let span = document.createElement("span");
            span.innerText = source.name;
            sourcesDiv.appendChild(span);
        });
        entry.appendChild(sourcesDiv);
    } else {alert("No valid sources found!!!");}
}

function addListListeners() {
    const container = document.querySelector(".entertainment-information");
    container.addEventListener("click", async (e) => {
        const entry = e.target.closest(".entry-container");
        console.log(entry.dataset.label);
        if (entry) {
            const title_id = e.target.dataset.label;
            const detailsURL = `https://api.watchmode.com/v1/title/${title_id}/details/?apiKey=${API_KEY}&append_to_response=sources`;
            try {    
                let data = await fetchData(detailsURL);
                const validSources = data.sources.filter( source => source.region == "US");
                displaySources(validSources, entry);
            } catch (error) {console.error(error);}            
        }
    });
}


function addSearchesEventListener() {
    const container = document.querySelector(".search-information");
    container.addEventListener("click", async (e) => {
        let entryContainer = e.target.closest(".entry-container");
        if(entryContainer) {
            const searchValue = entryContainer.innerText;      
            const searchURL = `https://api.watchmode.com/v1/search/?apiKey=${API_KEY}&search_field=name&search_value=${encodeURI(searchValue)}`;  
            try {
                let info = parseJson(await fetchData(searchURL));
                if (!Object.keys(info).length == 0) {
                    listMovies(info);
                } else {
                    alert("No movies found under that name");
                }
                addListListeners();
            } catch(error) {console.log(error);}
        }
    });
}

function displayLocalStorage(data) {
    if (data) {
        const container = document.querySelector(".search-information");   
        let searches = data.split(",");
        searches.forEach((search) => {
            const div = document.createElement("div");
            div.classList.add("entry-container");
            const span = document.createElement("span");
            span.innerText = search;
            div.appendChild(span);
            container.appendChild(div);
        });
        addSearchesEventListener();
    }
}

// Adds values to local storage (to be displayed)
function addToLocalStorage(search) {
    const container = document.querySelector(".search-information");
    let data = localStorage.getItem("search");
    if (data) {
        data += "," + (search);
    } else {
        data = search;
    }
        const div = document.createElement("div");
        div.innerText = search;
        div.classList.add("entry-container");
        container.appendChild(div);
    localStorage.setItem("search", data);
}

// Displays the movies
function listMovies(movies) {
    const container = document.querySelector(".entertainment-information");
    clearElement(container); // Clear the container every time you display the movies
    // Itterate through movies container
    Object.values(movies).forEach((movie) => {
        const movieDiv = document.createElement("div");
        movieDiv.dataset.label = movie.id;
        movieDiv.classList.add("entry-container");
        const span = document.createElement("span");
        span.innerText = movie.name;
        movieDiv.appendChild(span);
        container.appendChild(movieDiv);
    });
}



// Fetches data at url and returns data as JSON
async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) { // if response is not ok, throw error
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parses and returns the response as a JSON (i.e. object)
        const data = await response.json();
        return data; // Returns the data
    } catch (error) { // if error is thrown, handles it
        console.error("Error occurred: ", error);
        return {}; // Return default empty object
    }
}

// Parses json data 
function parseJson(data) {
    let info = {};
    data.title_results.forEach((item, i) => {
        info[`Movie ${i}`] = {
            "name": item.name,
            "id": item.id
        }
    })
    return info;
}

// Adds form functionality
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents page refresh
    const searchValue = document.querySelector(".search-input").value;
    document.querySelector(".search-input").value = ""; // Clears value after submiting form
    const searchURL = `https://api.watchmode.com/v1/search/?apiKey=${API_KEY}&search_field=name&search_value=${encodeURI(searchValue)}`;
    addToLocalStorage(searchValue);
    try {
        let info = parseJson(await fetchData(searchURL));
        if (!Object.keys(info).length == 0) {
            listMovies(info);
            addListListeners();            
        } else {
            alert("No movies found under that name");
        }
    } catch(error) {
        console.error("Error fetching data: ", error);
    }
});


// Clears local storage
clearButton.addEventListener("click", ()=> {
    const container = document.querySelector(".search-information");
    clearElement(container);
    localStorage.removeItem("search");
});

// Helper function
function clearElement(element) {element.innerHTML = '';}

