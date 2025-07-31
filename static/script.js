/* script.js */

let map;
let AdvancedMarkerElement;

async function initMap() {
    const position = { lat: 0, lng: 0 };
    const { Map } = await google.maps.importLibrary("maps");
    const markerLibrary = await google.maps.importLibrary("marker");
    AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
    const PinElement = markerLibrary.PinElement;
    const button = document.getElementById("load-news");

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: position,
        gestureHandling: "none",
        keyboardShortcuts: false,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        mapId: "DEMO_MAP_ID"
    });

    // Create a PinElement with the custom glyph
    const pin = new PinElement({
        glyph: "\ue530",
        glyphColor: "#ffffff",
        background: "#4b8bf4", // You can customize the background color
        borderColor: "#3a6fbd"  // You can customize the border color
    });

    // Create the marker using the PinElement
    new AdvancedMarkerElement({
        position: { lat: 36.6163, lng: -100.6 },
        map: map,
        content: pin.element, // Use the PinElement's content
        title: "Material Icon Font Marker",
    });

    // Ensure the fetch is called after map initialization
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
    if (!AdvancedMarkerElement) {
        console.error("AdvancedMarkerElement not loaded yet.");
        return;
    }

    data.forEach(item => {
        const marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: item.Latitude, lng: item.Longitude },
        });
        markers.push(marker);
    });
}

window.onload = initMap;