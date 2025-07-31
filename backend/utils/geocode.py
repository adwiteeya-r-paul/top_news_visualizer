# utils/geocode.py

import pycountry
from geopy.geocoders import GoogleV3
from dotenv import load_dotenv
import os

load_dotenv()
google_api_key = os.getenv('API_KEY')
geolocator = GoogleV3(api_key=google_api_key)

def get_geocode(isocode):
    country = pycountry.countries.get(alpha_2=isocode)
    location = geolocator.geocode(country.name)
    return [location.latitude, location.longitude] 

