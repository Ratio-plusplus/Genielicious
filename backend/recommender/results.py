# from firebase_init import getTestUser 
from firebase_init import getUser
from yelp import getStore
import json

def clearCache(user_id):
    # user = getTestUser(user_id)
    user = getUser(user_id)
    user.update({
        "surveyCache" : "",
        "budgetCache" : "",
        "resultsCache": "",
        "distanceCache": ""
    })

    return f"Successfullly cleared cache from userID: {user_id}" # confirmation

def getResults(user_id):
    # user = getTestUser(user_id) 
    user = getUser(user_id)
    
    results = user.child("resultsCache").get()
    if not results:
        return {"Error 401" : "No results compiled."}
    results = json.loads(results)
    return results

def compileResults(user_id, food_item:str):
    # user = getTestUser(user_id) 
    user = getUser(user_id)

    # getting user location
    latitude = user.child("location").child("latitude").get()
    longitude = user.child("location").child("longitude").get()
    coords = (latitude, longitude)

    #TODO: update how distance and budget are retrieved to reflect how active food profiles are setup
    # getting user budget
    budget = user.child("budget").get()
    if budget: # checks if budget exists and is not empty string
        budget = int(budget)
        if budget > 4:
            budget = 4
    else: budget = int(user.child("budgetCache").get())

    # getting user distance preference
    distance = user.child("distance").get()
    if distance: # checks if distance exists and is not empty string
        distance = int(distance)
    else: distance = int(user.child("distanceCache").get())

    yelp_results = getStore(coords, term = food_item, price=budget, radius=distance)
    # [OPTIONAL]: Parse Yelp results to not include unnecessary/extra fields

    clearCache(user_id)
    user.update({
        "resultsCache" : json.dumps(yelp_results)
    })