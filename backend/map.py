from flask import Flask, jsonify
import pandas as pd
import time
import os
from dotenv import load_dotenv
from flask_cors import CORS

from utils.youtube import youtube
from utils.geocode import get_geocode


app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    api_key = os.getenv('API_KEY')
    return jsonify(api_key=api_key)


@app.route("/api/plot")
def plot():
    now = time.time()
    df = youtube()
    for row in df['Country']:
        df.loc[df['Country'] == row, 'Latitude'] = get_geocode(row)[0]
        df.loc[df['Country'] == row, 'Longitude'] = get_geocode(row)[1]

    return df.to_json(orient='records')



