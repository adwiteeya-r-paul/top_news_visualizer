/* script.js */

let map;
let AdvancedMarkerElement; // Declare globally to be accessible in updateUI
let PinElement; // Declare globally for consistency

async function initMap() {
    console.log("initMap: Function started.");
    const position = { lat: 0, lng: 0 };
    try {
        // Import libraries asynchronously
        console.log("initMap: Attempting to import Google Maps libraries...");
        const { Map } = await google.maps.importLibrary("maps");
        const markerLibrary = await google.maps.importLibrary("marker");
        console.log("initMap: Google Maps libraries imported successfully.");

        // Assign imported classes to global variables
        AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
        PinElement = markerLibrary.PinElement;

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 2,
            center: position,
            gestureHandling: "none",
            keyboardShortcuts: false,
            disableDoubleClickZoom: true,
            fullscreenControl: false,
            mapId: "DEMO_MAP_ID" // Required for Advanced Markers
        });
        console.log("initMap: Google Map instance created.");

        // Create a PinElement for the initial marker with a custom glyph
        const initialPin = new PinElement({
            glyph: "\ue530", // Material Icons code for a location pin
            glyphColor: "#ffffff", // White glyph
            background: "#4b8bf4", // Blue background for the pin
            borderColor: "#3a6fbd"  // Darker blue border for the pin
        });

        // Create the initial AdvancedMarkerElement using the PinElement
        new AdvancedMarkerElement({
            position: { lat: 36.6163, lng: -100.6 }, // Example position
            map: map, // Attach to the map
            content: initialPin.element, // Use the DOM element from the PinElement
            title: "Material Icon Font Marker", // Tooltip text
        });
        console.log("initMap: Initial marker added.");

        // Call fetchdata immediately after map initialization
        console.log("initMap: Calling fetchdata()...");
        fetchdata();
        console.log("initMap: fetchdata() call initiated.");

    } catch (error) {
        // This catch block will log any errors that occur during the async operations
        console.error("initMap: An error occurred during map initialization or library import:", error);
    }
}

let data = [];
let markers = [];

function fetchdata() {
    console.log("fetchdata: Function started.");
    // Clear existing markers from the map
    markers.forEach(marker => marker.setMap(null));
    markers = []; // Reset the markers array

    // Fetch data from your Flask API endpoint
    console.log("fetchdata: Attempting to fetch data from /api/plot...");
    fetch("/api/plot")
        .then(res => {
            console.log("fetchdata: Received response from /api/plot. Status:", res.status);
            // Check if the response is OK (status 200-299)
            if (!res.ok) {
                // If not OK, read the response as text to get the error message
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
                });
            }
            // If OK, parse the response as JSON
            return res.json();
        })
        .then(json => {
            console.log("fetchdata: Data parsed successfully:", json);
            data = json; // Store the fetched data
            updateUI(data); // Update the UI with the new data
        })
        .catch(error => {
            // Log any errors during the fetch operation
            console.error("fetchdata: Error during fetch operation:", error);
            // You might want to display a user-friendly message on the UI here
        });
}

function updateUI(data) {
    console.log("updateUI: Function started with data:", data);
    // Ensure AdvancedMarkerElement is loaded before trying to use it
    if (!AdvancedMarkerElement) {
        console.error("updateUI: AdvancedMarkerElement not loaded yet. Cannot update UI.");
        return;
    }

    // Iterate over the fetched data and create markers
    data.forEach(item => {
        // Create a new AdvancedMarkerElement for each data item
        const marker = new AdvancedMarkerElement({
            map: map, // Attach to the map
            position: { lat: item.Latitude, lng: item.Longitude }, // Set position from data
            // You can add more customization here if needed, e.g., content: new PinElement(...).element
        });
        markers.push(marker); // Add the marker to our array
    });
    console.log(`updateUI: Added ${data.length} markers to the map.`);
}

// Initialize the map when the window loads
window.onload = initMap;