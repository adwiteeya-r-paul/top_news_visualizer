from flask import Flask
import pandas as pd
import time

from utils.youtube import youtube
from utils.geocode import get_geocode

app = Flask(__name__)

@app.route("/api/plot")
def plot():
    now = time.time()
    df = youtube()
    for row in df['Country']:
        df.loc[df['Country'] == row, 'Latitude'] = get_geocode(row)[0]
        df.loc[df['Country'] == row, 'Longitude'] = get_geocode(row)[1]

    return df.to_json(orient='records')



