from flask import Flask, send_from_directory
from youtube import youtube
from geocode import get_geocode


app = Flask(__name__)


@app.route("/")
def serve_index():
    return send_from_directory('static', 'index.html')

@app.route("/<path:path>")
def serve_static_file(path):
    return send_from_directory('static', path)

@app.route("/api/plot")
def plot():
    df = youtube()
    for row in df['Country']:
        df.loc[df['Country'] == row, 'Latitude'] = get_geocode(row)[0]
        df.loc[df['Country'] == row, 'Longitude'] = get_geocode(row)[1]

    return df.to_json(orient='records')



import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

