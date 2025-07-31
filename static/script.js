/* script.js */

let map;

async function initMap() {
    const position = { lat: 0, lng: 0 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const button = document.getElementById("load-news");

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: position,
        gestureHandling: "none",
        keyboardShortcuts: false,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
    });

    // The provided example marker is not needed for the core functionality
    // but I'll keep it as a demonstration if you want to use it.
    new google.maps.Marker({
        position: { lat: 36.6163, lng: -100.6 },
        map,
        label: {
            text: "\ue530",
            fontFamily: "Material Icons",
            color: "#ffffff",
            fontSize: "18px",
        },
        title: "Material Icon Font Marker",
    });

    // Add the event listener to call fetchdata() when the button is clicked
    button.addEventListener("click", fetchdata);
}

let data = [];
let markers = []; // Store markers to clear them on each refresh

function fetchdata() {
    // Clear existing markers before fetching new data
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    fetch("/api/plot")
        .then(res => res.json())
        .then(json => {
            data = json;
            updateUI(data);
        })
        .catch(error => console.error("Error fetching data:", error));
}


function updateUI(data) {
    const { AdvancedMarkerElement } = google.maps;
    data.forEach(item => {
        const marker = new AdvancedMarkerElement({ // Correctly instantiate the AdvancedMarkerElement
            map: map,
            position: { lat: item.Latitude, lng: item.Longitude },
        });
        markers.push(marker); // Add the new marker to the array
    });
}

window.onload = initMap;