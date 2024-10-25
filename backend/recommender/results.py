from firebase_init import getTestUser 
from firebase_init import getUser
from yelp import getStore
import json

def clearCache(user_id):
    user = getTestUser(user_id)
    user.update({
        "surveyCache" : "",
        "resultsCache" : ""
    })

    return f"Successfullly cleared cache from userID: {user_id}" # confirmation

def getResults(user_id):
    user = getTestUser(user_id) # TODO: change to getUser()
    results = user.child("resultsCache").get()
    if not results:
        return {"Error 401" : "No results compiled."}
    results = json.loads(results)
    return results

def compileResults(user_id, food_item:str):
    # TODO fill resultsCache with output from yelp
    user = getTestUser(user_id) # TODO: change to getUser()

    # getting user location
    latitude = user.child("location").child("latitude").get()
    longitude = user.child("location").child("longitude").get()
    coords = (latitude, longitude)

    # getting user budget
    budget = user.child("budget").get()
    if budget: # checks if budget exists and is not empty string
        budget = int(budget) 
    else: budget = None

    # getting user distance preference
    distance = user.child("distance").get()
    if distance: # checks if distance exists and is not empty string
        distance = int(distance)
    else: distance = None

    # TODO: return yelp results after testing
    # yelp_results = getStore(coords, term = food_item, price=budget, radius=distance)
    # [OPTIONAL]: Parse Yelp results to not include unnecessary/extra fields

    # user.update({
    #     "resultsCache" : json.dumps(yelp_results)
    # })
    user.update({ #### TESTING FIRST
        "resultsCache" : json.dumps({"Test output" : "this is test"})
    })