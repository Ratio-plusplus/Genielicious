# The point of this file is to explore yelp api capabilities and compile data

import requests
import json
import os
from dotenv import find_dotenv, load_dotenv

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

# # # DO NOT add .env file to version control
# ID = os.getenv("YELP_CLIENT_ID")
API_KEY = os.getenv("YELP_API_KEY")
# # #

# func to get yelp results on specialized queries
def getStore(coordinates, term = None, categories = "restaurants", radius=16000, sort_by = "rating", checkOpen = False, price = None):
    url = "https://api.yelp.com/v3/businesses/search"

    query = {"latitude": coordinates[0], "longitude": coordinates[1], 
             "radius": radius, sort_by: sort_by, "categories" : categories}
    
    # if term exists then add that parameter to the query, otherwise use the default category option
    if term:
        query["term"] = term

    if checkOpen:
        query["open_now"] = True

    if price:
        query["price"] = price
    
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }

    response = requests.request(
        "GET", url, headers=headers, params=query
    )
    return response.json()

# gets all supported categories within locale (e.g en_US)
def categoryDetails(locale: str = "en_US"):
    url = f"https://api.yelp.com/v3/categories"

    query = dict()
    if locale:
        query["locale"] = locale

    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }

    response = requests.request(
        "GET", url, headers=headers, params=query
    )
    return response.json()

if __name__ == "__main__":
    CSULB_coordinates = (33.78336745904146, -118.1101659429386) # test location (lat,long)
    default_radius = 16000 # ~10 miles in meters
    default_category = "restaurants"

    # res = getStore(CSULB_coordinates, categories="raw_food")
    # res = categoryDetails("en_US") # gets all businesses within en_US locale

    # # Cache results
    # with open('results.json', 'w') as file:
    #     json.dump(res, file, indent=4)
    # print("Dictionary written to file in JSON format.")
