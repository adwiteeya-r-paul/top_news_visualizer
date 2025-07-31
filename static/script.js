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

    new google.maps.AdvancedMarkerElement({
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

    fetchdata();
}

let data = [];
let markers = [];

function fetchdata() {
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
        const marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: item.Latitude, lng: item.Longitude },
        });
        markers.push(marker);
    });
}

window.onload = initMap;