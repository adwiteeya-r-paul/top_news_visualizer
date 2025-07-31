/* script.js */

let map;
let data = [];

fetch("https://top-news-visualizer.onrender.com/")
    .then(response => response.json())
        .then(json => {
            data = json;
            const apiKey = data.api_key;
            initMap(apiKey);
    })


async function initMap(Key) {
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: Key,
        version: "weekly",
    });


    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
        const position = { lat: 0, lng: 0 };
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const button = document.getElementById("load-news");

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: position,
        });
        button.addEventListener("click", function() {
            alert("Clicked!");
            fetchdata();
        });
    });
};



function fetchdata(){
    fetch("https://top-news-visualizer.onrender.com/api/plot")
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
            position: { lat: item.lat, lng: item.lng },
            title: item.title,
        });
    });
}

