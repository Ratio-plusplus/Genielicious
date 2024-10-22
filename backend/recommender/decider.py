# Provides and processes question within backend api

import json
import os
from yelp import getStore

SUPPORTED_REGIONAL_CUISINES = {"7":"African", "8":"Middle Eastern", "9":"South Asian", # cultural categories that are currently supported
                                "10":"East Asian", "11":"European", "12":"Latin American", 
                                "13":"North American"}
# ALL_OTHER_CATEGORIES = set(["Finger food", "Specialty", "Light Meals", "Vegan", 
#                             "Quick Eats", "Breakfast", "Desserts", "Health-Conscious",
#                             "Meat-Centric", "Comfort Food"])
MAIN_FLAVORS = {"2":"sweet","3":"salty", "4":"sour", "5":"umami", "6":"spicy"} # main flavors that we will take into account

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Create the full path to the file
file_path = os.path.join(script_dir, "data", "categorized_aliases.json")

with open(file_path, "r") as file:
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
def getFlavors(response:dict) -> None:
    for sid,flavor in MAIN_FLAVORS.items():
        response["questions"].append({
            "id": sid,
            "question": f"Do you want something {flavor}?",
            "answer_map": {
                "yes": 1, 
                "no": 0,
                "maybe": 2
            }
        })
        response["total"] += 1

# gets desired food categories in form of comma delimited string
def getCulture(response:dict) -> None:
    for sid,culture in SUPPORTED_REGIONAL_CUISINES.items():
        response["questions"].append({
            "id": sid,
            "question": f"Would you want {culture} food?",
            "answer_map": {
                "yes": 1, 
                "no": 0,
                "maybe": 2
            }
        })
        response["total"] += 1

# compiles questions to provide to frontend user; id's for each question provided
def getShortSessionQuestions(hasDistance:bool = False, hasPrice:bool = False) -> str:
    response = {"questions": [], "total" : 0}
    if not hasPrice: 
        getPriceQuestion(response, 0) # adds question to response object
    if not hasDistance:
        getDistance(response, 1)

    getFlavors(response)
    getCulture(response)

    return response

def processShortSessionAnswers(answers):
    # TODO: CHANGE HARDCODED LOCATION TO USER'S LOCATION BASED OFF DB
    USER_LOCATION = (33.78336745904146, -118.1101659429386)
    term = ""
    temp_term = ""
    categories = ""
    category_temp = ""

    price = int(answers["0"])
    distance = int(answers["1"])

    for i in range(2,2+len(MAIN_FLAVORS)):
        qid = str(i)
        if answers[qid] == "1": # 1 = yes
            term += MAIN_FLAVORS[qid] + " "
        elif answers[qid] == "2": # 2 = maybe
            temp_term = MAIN_FLAVORS[qid]
    if not term: # empty string, no yes answer, give the maybes
        term = temp_term

    for j in range(2+len(MAIN_FLAVORS),len(SUPPORTED_REGIONAL_CUISINES)):
        qid = str(j)
        cur_culture = SUPPORTED_REGIONAL_CUISINES[qid]
        if answers[qid] == "1": # 1 = yes
            categories = ",".join(CATEGORIZED_ALIASES[cur_culture]) # gets all categories from supported culture
            break
        elif answers[qid] == "2": # 2 = maybe; cache possible category
            category_temp = cur_culture

    if not categories and category_temp: # assign the maybe categories if empty
        categories= ",".join(CATEGORIZED_ALIASES[category_temp])    
    elif not categories: # if maybe categories still empy then assign broad category
        categories = "food,restaurants"

    results = getStore(USER_LOCATION, term = term, categories=categories, price = price, radius = distance)
    if results["total"] == 0: # check if there are any results
        results = getStore(USER_LOCATION, term = term.split(" ")[0], categories="food,restaurants", price = price, radius = distance)

    return results

if __name__ == "__main__":
    from yelp import cacheToJson
    USER_LOCATION = (33.78336745904146, -118.1101659429386) # should be provided by the client, using CSULB coords to test
    USER_PRICE = None # provided by user profile
    USER_DISTANCE = None # provided by user profile

    RESULTS_PATH = f"{os.getcwd()}\\results.json"
    results = getShortSessionQuestions()

    # Cache results
    cacheToJson(RESULTS_PATH,results)
    print(f"Number of results:{results['total']}")