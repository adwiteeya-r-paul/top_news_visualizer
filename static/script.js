/* script.js */

let map;
let AdvancedMarkerElement; // Declare globally to be accessible in updateUI
let PinElement; // Declare globally for consistency

async function initMap() {
    console.log("initMap: Function started.");
    const position = { lat: 0, lng: 0 };
    try {
        // Import Google Maps libraries asynchronously.
        // This ensures that the 'maps' and 'marker' libraries are loaded before use.
        console.log("initMap: Attempting to import Google Maps libraries...");
        const { Map } = await google.maps.importLibrary("maps");
        const markerLibrary = await google.maps.importLibrary("marker");
        console.log("initMap: Google Maps libraries imported successfully.");

        // Assign imported classes to global variables for broader accessibility.
        AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
        PinElement = markerLibrary.PinElement;

        // Initialize the Google Map instance.
        // The mapId "DEMO_MAP_ID" is crucial for Advanced Markers.
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 2, // Initial zoom level
            center: position, // Initial center of the map (0,0)
            gestureHandling: "none", // Disables map panning/zooming via gestures
            keyboardShortcuts: false, // Disables keyboard navigation
            disableDoubleClickZoom: true, // Disables zoom on double-click
            fullscreenControl: false, // Hides the fullscreen button
            mapId: "DEMO_MAP_ID" // Required for Advanced Markers and cloud-based styling
        });
        console.log("initMap: Google Map instance created.");

        // Create a PinElement for the initial marker.
        // This acts as a placeholder or a default marker on load.
        const initialPin = new PinElement({
            glyph: "\ue530", // Material Icons code for a location pin icon
            glyphColor: "#ffffff", // White color for the icon
            background: "#4b8bf4", // Blue background for the pin
            borderColor: "#3a6fbd"  // Darker blue border for the pin
        });

        // Create the initial AdvancedMarkerElement using the PinElement.
        new AdvancedMarkerElement({
            position: { lat: 36.6163, lng: -100.6 }, // A default central position
            map: map, // Attach this marker to the initialized map
            content: initialPin.element, // Use the custom PinElement as the marker's content
            title: "Material Icon Font Marker", // Tooltip text when hovering over the marker
        });
        console.log("initMap: Initial marker added.");

        // Call fetchdata immediately after map initialization to load initial news data.
        console.log("initMap: Calling fetchdata()...");
        fetchdata();
        console.log("initMap: fetchdata() call initiated.");

        // Set up automatic updates for the map data every 60 seconds (60000 milliseconds).
        // This keeps the news data fresh without manual refresh.
        setInterval(fetchdata, 60000);
        console.log("initMap: Automatic data refresh set up for every 60 seconds.");

    } catch (error) {
        // Catch and log any errors that occur during the asynchronous map initialization
        // or library import process.
        console.error("initMap: An error occurred during map initialization or library import:", error);
    }
}

let data = []; // Stores the fetched news data
let markers = []; // Stores the current markers on the map

function fetchdata() {
    console.log("fetchdata: Function started.");
    // Clear all existing markers from the map before fetching new data.
    // This prevents old markers from accumulating.
    markers.forEach(marker => marker.setMap(null));
    markers = []; // Reset the markers array to be empty

    // Fetch data from Flask API endpoint '/api/plot'.
    console.log("fetchdata: Attempting to fetch data from /api/plot...");
    fetch("/api/plot")
        .then(res => {
            console.log("fetchdata: Received response from /api/plot. Status:", res.status);
            // Check if the HTTP response was successful (status code 200-299).
            if (!res.ok) {
                // If the response is not OK, read the response body as text
                // and throw an error with details for debugging.
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
                });
            }
            // If the response is OK, parse the response body as JSON.
            return res.json();
        })
        .then(json => {
            console.log("fetchdata: Data parsed successfully:", json);
            data = json; // Store the successfully fetched JSON data
            updateUI(data); // Call updateUI to render markers on the map
        })
        .catch(error => {
            // Catch and log any errors that occur during the fetch operation,
            // including network errors or errors from the server response.
            console.error("fetchdata: Error during fetch operation:", error);
            // In a production app, you might display a user-friendly error message here.
        });
}

function updateUI(data) {
    console.log("updateUI: Function started with data:", data);
    // Ensure that AdvancedMarkerElement and PinElement are loaded before attempting to use them.
    if (!AdvancedMarkerElement || !PinElement) {
        console.error("updateUI: AdvancedMarkerElement or PinElement not loaded yet. Cannot update UI.");
        return;
    }

    // Iterate over the fetched data array to create and place markers on the map.
    data.forEach(item => {
        let markerColor;
        let glyphText;

        // Determine marker color and emoji glyph based on the sentiment of the news item.
        switch (item.Sentiment) {
            case "Positive":
                markerColor = "#4CAF50"; // Green for positive sentiment
                glyphText = "\u{1F604}"; // Smiling face emoji
                break;
            case "Negative":
                markerColor = "#F44336"; // Red for negative sentiment
                glyphText = "\u{1F621}"; // Pouting face emoji
                break;
            case "Neutral":
            default:
                markerColor = "#FFC107"; // Amber/Yellow for neutral or undefined sentiment
                glyphText = "\u{1F610}"; // Neutral face emoji
                break;
        }

        // Create a PinElement for the current item with sentiment-based styling.
        // The PinElement defines the visual appearance of the marker.
        const pin = new PinElement({
            glyph: glyphText, // The emoji or icon to display inside the pin
            glyphColor: "#ffffff", // Color of the glyph (white for contrast)
            background: markerColor, // Background color of the pin
            borderColor: markerColor // Border color matches background for a solid look
        });

        // Create a new AdvancedMarkerElement for each data item.
        const marker = new AdvancedMarkerElement({
            map: map, // Attach this marker to the main map instance
            position: { lat: item.Latitude, lng: item.Longitude }, // Set marker position using geocoded latitude and longitude
            content: pin.element, // Use the custom PinElement's DOM element as the marker's content
            title: `${item.Title} (Sentiment: ${item.Sentiment})`, // Tooltip text displayed on hover
        });
        markers.push(marker); // Add the newly created marker to our global markers array
    });
    console.log(`updateUI: Added ${data.length} markers to the map.`);
}

// Initialize the map when the entire window and its resources have loaded.
window.onload = initMap;