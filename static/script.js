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
        arrowControl: false,
        zoomControl: false,
        fullscreenControl: false,
    });

    marker = new AdvancedMarkerElement({
        map: map,
        position: position,
    });

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
        const marker = new AdvancedMarkerElement({
            map: map,
            position: { lat: item.Latitude, lng: item.Longitude },
        });
    });
}

window.onload = initMap;
