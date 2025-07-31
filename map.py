# map.py
from flask import Flask, send_from_directory, Response
from youtube import youtube
from geocode import get_geocode
import os

app = Flask(__name__)

# Create a cache to store geocoded locations
geocode_cache = {}

@app.route("/")
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route("/<path:path>")
def serve_static_file(path):
    return send_from_directory('static', path)

@app.route("/api-key.js")
def serve_api_key():
    api_key = os.environ.get("API_KEY")
    response_js = f"var API_KEY = '{api_key}';"
    return Response(response_js, mimetype='application/javascript')

@app.route("/api/plot")
def plot():
    df = youtube()
    for index, row in df.iterrows():
        country_code = row['Country']
        if country_code not in geocode_cache:
            geocode_cache[country_code] = get_geocode(country_code)
        
        lat, lon = geocode_cache[country_code]
        df.loc[index, 'Latitude'] = lat
        df.loc[index, 'Longitude'] = lon

    return df.to_json(orient='records')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)