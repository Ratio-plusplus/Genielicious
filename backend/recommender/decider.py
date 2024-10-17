# Provides and processes question within backend api

import json
import os
from yelp import getStore

SUPPORTED_REGIONAL_CUISINES = set(["African", "Middle Eastern", "South Asian", # cultural categories that are currently supported
                                   "East Asian", "European", "Latin American", 
                                   "North American"])
ALL_OTHER_CATEGORIES = set(["Finger food", "Specialty", "Light Meals", "Vegan", 
                            "Quick Eats", "Breakfast", "Desserts", "Health-Conscious",
                            "Meat-Centric", "Comfort Food"])
MAIN_FLAVORS = set(["sweet","salty", "sour", "umami", "spicy"]) # main flavors that we will take into account

with open("data\\categorized_aliases.json", "r") as file:
    CATEGORIZED_ALIASES = json.load(file)

# preliminary questions
# yelp parameter price takes integer 1 through 4
def getPriceQuestion(response:dict, sid:int) -> None:
    response["questions"].append({
        "id": str(sid),
        "question": "How much are you willing to spend?",
        "answer_map": { 
            "$10 or less": 1, # key = display answers for the front end
            "$30 or less": 2, # value = acceptable response to question that backend can understand
            "$60 or less": 3, #    ... in this case the numbers represent yelp price categories
            "More than $60": 4
        }
    })
    response["total"] += 1

# yelp parameter takes integer variable which represents distance in meters
def getDistance(response:dict, sid:int) -> None:
    response["questions"].append({ # mutable object list
        "id": str(sid),
        "question": "How far are you willing to travel?",
        "answer_map": { 
            "10 miles or less": 16093, # key = display answers for the front end
            "15 miles or less": 24140, # value = acceptable response to question that backend can understand
            "20 miles or less": 32187, #    ... in this case the numbers represent equivalent miles converted to meters
            "25 miles or less": 40000
        }
    })
    response["total"] += 1

# get desired flavors in form of space delimited string
def getFlavors(response:dict, sid:int) -> None:
    for i,flavor in enumerate(MAIN_FLAVORS):
        response["questions"].append({
            "id": str(sid+i),
            "question": f"Do you want something {flavor}?",
            "answer_map": {
                "yes": 1, 
                "no": 0,
                "maybe": 2
            }
        })
        response["total"] += 1

# gets desired food categories in form of comma delimited string
def getCulture(response:dict, sid:int) -> None:
    for i,culture in enumerate(SUPPORTED_REGIONAL_CUISINES):
        response["questions"].append({
            "id": str(sid+i),
            "question": f"Would you want {culture} food?",
            "answer_map": {
                "yes": 1, 
                "no": 0,
                "maybe": 2
            }
        })
        response["total"] += 1

def getShortSessionQuestions(hasDistance:bool = False, hasPrice:bool = False) -> str:
    response = {"questions": [], "total" : 0}
    if not hasPrice: 
        getPriceQuestion(response, 0) # adds question to response object
    if not hasDistance:
        getDistance(response, 5)

    getFlavors(response, 9)
    getCulture(response, 20)

    return response

if __name__ == "__main__":
    from yelp import cacheToJson
    USER_LOCATION = (33.78336745904146, -118.1101659429386) # should be provided by the client, using CSULB coords to test
    USER_PRICE = None # provided by user profile
    USER_DISTANCE = None # provided by user profile

    RESULTS_PATH = f"{os.getcwd()}\\results.json"
    results = getShortSessionQuestions()

    # Cache results
    cacheToJson(RESULTS_PATH,results)
    print(f"Number of results:{results["total"]}")