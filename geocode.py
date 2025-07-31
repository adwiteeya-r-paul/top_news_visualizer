# utils/geocode.py
import pycountry
from geopy.geocoders import GoogleV3
import os

geolocator = GoogleV3(api_key=os.environ.get("API_KEY"))

def get_geocode(isocode):
    country = pycountry.countries.get(alpha_2=isocode)
    location = geolocator.geocode(country.name)
    return [location.latitude, location.longitude]
