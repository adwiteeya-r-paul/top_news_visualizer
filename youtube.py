# api/youtube.py
from deep_translator import GoogleTranslator
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import requests
import pandas as pd
import sqlalchemy
import json
import country_converter as coco
import random
import os
from dotenv import load_dotenv

load_dotenv()

baseurl = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&regionCode="
countrylist = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'OM', 'QA', 'SA', 'TN', 'YE', 'AZ', 'BY', 'BG', 'BD', 'BA', 'CZ', 'DK', 'AT', 'CH', 'DE', 'GR', 'AU', 'BE', 'CA', 'GB', 'GH', 'IE', 'IL', 'IN', 'JM', 'KE', 'MT', 'NG', 'NZ', 'SG', 'UG', 'US', 'ZA', 'ZW', 'AR', 'BO', 'CL', 'CO', 'CR', 'DO', 'EC', 'ES', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE', 'EE', 'FI', 'PH', 'FR', 'SN', 'HR', 'HU', 'ID', 'IS', 'IT', 'JP', 'GE', 'KZ', 'KR', 'LU', 'LA', 'LT', 'LV', 'MK', 'MY', 'NO', 'NP', 'NL', 'PL', 'BR', 'PT', 'MD', 'RO', 'RU', 'LK', 'SK', 'SI', 'ME', 'RS', 'SE', 'TZ', 'TH', 'TR', 'UA', 'PK', 'VN', 'HK', 'TW', 'CY', 'KH', 'LI', 'PG']
titledict = {}

# Ensure NLTK data is downloaded. This should ideally be in a build step or release command.
# For debugging, we'll keep it here, but be aware of potential performance impact.
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError: # Changed from nltk.downloader.DownloadError to LookupError
    print("NLTK vader_lexicon not found, attempting to download...")
    nltk.download('vader_lexicon')
    print("NLTK vader_lexicon downloaded.")

def youtube():
    print("Starting youtube() function...")
    sia = SentimentIntensityAnalyzer()
    data_for_df = []



    for country in countrylist:
        try:
            url = baseurl + country + "&videoCategoryId=25&key=" + os.environ.get("API_KEY")
            print(f"Fetching URL for {country}: {url}") # Log the URL (be careful not to expose API key in public logs)
            response = requests.get(url)
            response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
            json_response = response.json()
            print(f"Received response for {country}: {json_response}")

            if 'items' in json_response and json_response['items']:
                title = json_response['items'][0]['snippet']['title']
                print(f"Original title for {country}: {title}")
                if title:
                    translated = GoogleTranslator(source='auto', target='english').translate(text=title)
                    print(f"Translated title for {country}: {translated}")
                    sentiment_score = sia.polarity_scores(translated)['compound']
                    if sentiment_score >= 0.05:
                        sentiment = "Positive"
                    elif sentiment_score <= -0.05:
                        sentiment = "Negative"
                    else:
                        sentiment = "Neutral"

                    data_for_df.append({
                        'Country': country,
                        'Title': translated,
                        'Sentiment': sentiment
                    })
                else:
                    print(f"No title found for country {country}")
            else:
                print(f"No items found in response for country {country}")

        except requests.exceptions.RequestException as e:
            print(f"Request failed for country {country}: {e}")
            print(f"Response content: {response.text if 'response' in locals() else 'No response object'}")
        except json.JSONDecodeError as e:
            print(f"JSON decode error for country {country}: {e}")
            print(f"Raw response text: {response.text if 'response' in locals() else 'No response object'}")
        except Exception as e:
            print(f"An unexpected error occurred for country {country}: {e}")

    df = pd.DataFrame(data_for_df)
    print(f"DataFrame created with {len(df)} rows.")
    return df
