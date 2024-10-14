# Main algorithm to decide which food item the user wants
# initially created in accordance with mock_food_data.json (DEPRECATED); before we committed to yelp api
# TODO: remake file with use of yelp api data

import json
from yelp import getStore

SUPPORTED_REGIONAL_CUISINES = set(["African", "Middle Eastern", "South Asian", # cultural categories that are currently supported
                                   "East Asian", "European", "Latin American", 
                                   "North American"])
ALL_OTHER_CATEGORIES = set(["Finger food", "Specialty", "Light Meals", "Vegan", 
                            "Quick Eats", "Breakfast", "Desserts", "Health-Conscious",
                            "Meat-Centric", "Comfort Food"])
MAIN_FLAVORS = set(["sweet","salty", "sour", "umami", "spicy"]) # main flavors that we will take into account

with open("recommender\\data\\categorized_aliases.json", "r") as file:
    CATEGORIZED_ALIASES = json.load(file)

# preliminary questions
# yelp parameter price takes integer 1 through 4
def getPrice() -> int:
    print("How much are you willing to spend?")
    print("1) < $10\n\
           2) < $30\n\
           3) < $60\n\
           4) >= $60\n")
    price = "2"
    while True:
        price = input()
        if price in ("1", "2", "3", "4"):
            break
        else:
            print("Invalid input")

    return int(price)

# yelp parameter takes integer variable which represents distance in meters
def getDistance() -> int:
    # # # this interaction only displayed when user hasn't shared a user profile
    distances = {
        "1": 10,
        "2": 15,
        "3": 20,
        "4": 25
    }
    print("How far are you willing to travel?")
    print("1) < 10 miles\n\
           2) < 15 miles\n\
           3) < 20 miles\n\
           4) < 25 miles\n")
    option = "1"
    while True:
        option = input()
        if option in ("1", "2", "3", "4"):
            break
        else:
            print("Invalid input")
    # # #

    distance = int(distances[option] * 1,609.344) # convert miles to meters
    if distance > 40000:
        distance = 40000 # max distance allowed for yelp api
    return distance

# get desired flavors in form of space delimited string
def getFlavors() -> str:
    flavor_list = []
    for flavor in MAIN_FLAVORS:
        choice = ""
        while True:
            choice = str(input(f"Do you want something {flavor}? (y/n/m)"))
            if choice not in ("y", "n", "m"):
                print("invalid input")
            else:
                break
        if choice == "y":
            flavor_list.insert(0,flavor) # more relevant flavor
        elif choice == "m":
            flavor_list.append(flavor)
        
    return " ".join(flavor_list)

# gets desired food categories in form of comma delimited string
def getCulture() -> str:
    culture_res = None
    for culture in SUPPORTED_REGIONAL_CUISINES:
        choice = ""
        while True:
            choice = str(input(f"Would you want {culture} food? (y/n/m)"))
            if choice not in ("y", "n", "m"):
                print("invalid input")
            else:
                break

        if choice == "y": # for now we return on first desired culture, other configurations may be faster
            culture_res = culture
            break

    if not culture_res: # in case user said "no" to every cultural food
        culture_res = "food"
    else:
        culture_res = ",".join(CATEGORIZED_ALIASES[culture_res])
        
    return culture_res

if __name__ == "__main__":
    USER_LOCATION = (33.78336745904146, -118.1101659429386) # should be provided by the client, using CSULB coords to test
    USER_PRICE = None # provided by user profile
    USER_DISTANCE = None # provided by user profile

    if not USER_PRICE: 
        price = getPrice()
    if not USER_DISTANCE: 
        distance = getDistance()

    flavors = getFlavors()
    categories = getCulture()
    results = getStore(USER_LOCATION, term = flavors, categories=categories, price = price, distance = distance)

    # Cache results
    with open('results.json', 'w') as file:
        json.dump(results, file, indent=4)
    print("Dictionary written to file in JSON format.")