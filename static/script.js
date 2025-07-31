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
        gestureHandling: "none", // This prevents the user from panning or zooming with a mouse or touch gestures.
        keyboardShortcuts: false,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
    });
}

async function newmarker() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: 36.6163, lng: -100.6 },
    });
}

async function buttonadd() {
    button.addEventListener("click", function() {
        fetchdata();
    });
}

let data = [];

function fetchdata(){
    fetch("/api/plot")
        .then ( res => res.json())
            .then ( json => {
                data = json;
                updateUI(data);
            })
}


function updateUI(data){
    data.forEach(item => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: { lat: item.Latitude, lng: item.Longitude },
        });
    });
}

window.onload = initMap
window.onload = newmarker()
window.onload = buttonadd()

