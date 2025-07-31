from flask import Flask, jsonify, render_template
import pandas as pd
import time
import os
from dotenv import load_dotenv
from backend.utils.youtube import youtube
from backend.utils.geocode import get_geocode


app = Flask(__name__, template_folder='../templates', static_folder='../static')


@app.route("/")
def index():
    api_key = os.getenv('API_KEY')
    return render_template('index.html', api_key=api_key)


@app.route("/api/plot")
def plot():
    now = time.time()
    df = youtube()
    for row in df['Country']:
        df.loc[df['Country'] == row, 'Latitude'] = get_geocode(row)[0]
        df.loc[df['Country'] == row, 'Longitude'] = get_geocode(row)[1]

    return df.to_json(orient='records')



