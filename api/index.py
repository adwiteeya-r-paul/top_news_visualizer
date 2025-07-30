from flask import Flask
from deep_translator import GoogleTranslator
import json
import pandas as pd
import 
app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"