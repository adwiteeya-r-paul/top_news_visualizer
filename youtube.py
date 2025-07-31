# api/index.py
from deep_translator import GoogleTranslator
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import requests
import pandas as pd
import sqlalchemy
import json
import country_converter as coco
import random 

baseurl = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&regionCode="
countrylist = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'OM', 'QA', 'SA', 'TN', 'YE', 'AZ', 'BY', 'BG', 'BD', 'BA', 'CZ', 'DK', 'AT', 'CH', 'DE', 'GR', 'AU', 'BE', 'CA', 'GB', 'GH', 'IE', 'IL', 'IN', 'JM', 'KE', 'MT', 'NG', 'NZ', 'SG', 'UG', 'US', 'ZA', 'ZW', 'AR', 'BO', 'CL', 'CO', 'CR', 'DO', 'EC', 'ES', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE', 'EE', 'FI', 'PH', 'FR', 'SN', 'HR', 'HU', 'ID', 'IS', 'IT', 'JP', 'GE', 'KZ', 'KR', 'LU', 'LA', 'LT', 'LV', 'MK', 'MY', 'NO', 'NP', 'NL', 'PL', 'BR', 'PT', 'MD', 'RO', 'RU', 'LK', 'SK', 'SI', 'ME', 'RS', 'SE', 'TZ', 'TH', 'TR', 'UA', 'PK', 'VN', 'HK', 'TW', 'CY', 'KH', 'LI', 'PG']
titledict = {}

nltk.download('vader_lexicon')


def youtube():
    countries = random.sample(countrylist, 40)
    for country in countries:
        url = baseurl + country + "&videoCategoryId=25&key=" + "AIzaSyC-vtGc60bRI8XigEcCOuCJFLvKBYYqAf0"
        response = requests.get(url).json()

        # Check if 'items' exists and is not empty before trying to access it
        if 'items' in response and response['items']:
            title = response['items'][0]['snippet']['title']
            if title != "":
                translated = GoogleTranslator(source='auto', target='english').translate(text=title)
                titledict[country] = translated + "(Original title: " + title + ")"


    df = pd.DataFrame(list(titledict.items()),columns = ['Country','Title'])


    for index, row in df.iterrows():
        score = SentimentIntensityAnalyzer().polarity_scores(row['Title'])
        if score['compound'] >= 0.5:
            df.loc[index, 'Sentiment'] = 'Positive'
        elif score['compound'] <= -0.5:
            df.loc[index, 'Sentiment'] = 'Negative'
        else:
            df.loc[index, 'Sentiment'] = 'Neutral'

    return df