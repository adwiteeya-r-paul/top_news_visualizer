# map.py
from flask import Flask, send_from_directory, Response
from youtube import youtube
from geocode import get_geocode
import os
import json # Import json for manual JSON response
import traceback # Import traceback for detailed error logging

print("map.py: Script started.") # Added for debugging

app = Flask(__name__)

print("map.py: Flask app instance created.") # Added for debugging

# Create a cache to store geocoded locations
geocode_cache = {}

@app.route("/")
def serve_index():
    print("map.py: Serving index.html...")
    return send_from_directory('static', 'index.html')

@app.route("/<path:path>")
def serve_static_file(path):
    print(f"map.py: Serving static file: {path}")
    return send_from_directory('static', path)

@app.route("/api-key.js")
def serve_api_key():
    print("map.py: Serving api-key.js...")
    api_key = os.environ.get("API_KEY")
    response_js = f"var API_KEY = '{api_key}';"
    return Response(response_js, mimetype='application/javascript')

# Added a simple health check route
@app.route("/health")
def health_check():
    print("map.py: Health check requested.")
    return "OK", 200

@app.route("/api/plot")
def plot():
    print("map.py: Received request for /api/plot")
    try:
        df = youtube()
        print(f"map.py: youtube() function returned DataFrame with {len(df)} rows.")

        if df.empty:
            print("map.py: DataFrame is empty, returning empty JSON.")
            return json.dumps([]) # Return empty list if no data

        for index, row in df.iterrows():
            country_code = row['Country']
            if country_code not in geocode_cache:
                print(f"map.py: Geocoding country: {country_code}")
                try:
                    lat, lon = get_geocode(country_code)
                    geocode_cache[country_code] = [lat, lon]
                    print(f"map.py: Geocoded {country_code}: Lat={lat}, Lon={lon}")
                except Exception as e:
                    print(f"map.py: Error geocoding {country_code}: {e}")
                    traceback.print_exc() # Print full traceback for geocoding errors
                    continue # Skip to next country if geocoding fails

            lat, lon = geocode_cache[country_code]
            df.loc[index, 'Latitude'] = lat
            df.loc[index, 'Longitude'] = lon

        print("map.py: Finished processing data. Converting to JSON.")
        return df.to_json(orient='records')

    except Exception as e:
        print(f"map.py: An error occurred in /api/plot: {e}")
        traceback.print_exc() # Print full traceback for any error in plot()
        # Return a 500 error with a JSON message for the client
        error_message = {"error": "Internal Server Error", "details": str(e)}
        return Response(json.dumps(error_message), status=500, mimetype='application/json')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"map.py: Starting Flask app on port {port}...")
    app.run(host='0.0.0.0', port=port)

print("map.py: Script finished execution (if not running with app.run).") 