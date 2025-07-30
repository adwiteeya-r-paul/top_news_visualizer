# api/index.py

from flask import Flask
from deep_translator import GoogleTranslator
import requests
import pandas as pd
import sqlalchemy
import json
import country_converter as coco


app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"