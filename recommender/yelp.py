# The point of this file is to explore yelp api capabilities and compile data

import requests
import json

id_path = "C:/Users/alex/Desktop/id.txt"
key_path = "C:/Users/alex/Desktop/api_key.txt"

# # # DO NOT share actual keys with public.
ID = "id"
API_Key = "api key"
# # #

with open(id_path, 'r') as file:
    ID = file.readline()

with open(key_path, 'r') as file:
    API_Key = file.readline()

CSULB_coordinates = (33.78336745904146, -118.1101659429386) # test location (lat,long)
default_radius = 16000 # ~10 miles in meters
default_category = "restaurants"

# func to get results
def get_store(coordinates, term = None, categories = default_category, radius=default_radius, sort_by = "rating", checkOpen = False, price = None):
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
        "Authorization": f"Bearer {API_Key}"
    }

    response = requests.request(
        "GET", url, headers=headers, params=query
    )
    return response.json()

def categoryDetails(locale=None):
    url = f"https://api.yelp.com/v3/categories"

    query = dict()
    if locale:
        query["local"] = locale

    headers = {
        "Authorization": f"Bearer {API_Key}"
    }

    response = requests.request(
        "GET", url, headers=headers, params=query
    )
    return response.json()

# res = get_store(CSULB_coordinates, categories="raw_food")
# res = categoryDetails("en_US") # gets all businesses within en_US locale

# # Cache results
# with open('results.json', 'w') as file:
#     json.dump(res, file, indent=4)
# print("Dictionary written to file in JSON format.")
