import requests
import json

# # # DO NOT share to public. These API details must be deactivated if this repo were public.
ID = "id"
API_Key = "api key"
# # #

CSULB_coordinates = (33.78336745904146, -118.1101659429386) # test location (lat,long)
default_radius = 24140 # ~15 miles in meters
default_category = "restaurants"

def get_store(coordinates, category= default_category, radius=default_radius):
    url = "https://api.yelp.com/v3/businesses/search"

    query = {"latitude": coordinates[0], "longitude": coordinates[1], 
             "category":category, "radius": radius}
    
    headers = {
        "Authorization": f"Bearer {API_Key}"
    }

    response = requests.request(
        "GET", url, headers=headers, params=query
    )
    return response.json()

def categoryDetails(alias):
    url = f"https://api.yelp.com/v3/categories/{alias}"

    headers = {
        "Authorization": f"Bearer {API_Key}"
    }

    response = requests.request(
        "GET", url, headers=headers
    )
    return response.json()

res = get_store(CSULB_coordinates, "food")
# res = categoryDetails("restaurants")

# Write to results file to avoid making too many calls
with open('results.txt', 'w') as file:
    json.dump(res, file, indent=4)
print("Dictionary written to file in JSON format.")
