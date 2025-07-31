# utils/geocode.py

import pycountry
from geopy.geocoders import GoogleV3


geolocator = GoogleV3(api_key="=AIzaSyBaoXhplpt8-FESvK6YxKJi1fUWlnJYYI8")

def get_geocode(isocode):
    country = pycountry.countries.get(alpha_2=isocode)
    location = geolocator.geocode(country.name)
    return [location.latitude, location.longitude] 

