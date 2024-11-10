from firebase import getUserCacheRef, getActiveFoodProfile, getLocation
from yelp import getStore
import json

def clearCache(user_id):
    cache = getUserCacheRef(user_id)
    cache.update({
        "surveyCache" : "",
        "budgetCache" : "",
        "resultsCache": "",
        "distanceCache": ""
    })

    return f"Successfullly cleared cache from userID: {user_id}" # confirmation

def getResults(user_id):
    results = getUserCacheRef(user_id).child("resultsCache").get()
    if not results:
        return {"Error 401" : "No results compiled."}
    results = json.loads(results)
    return results

def compileResults(user_id, food_item:str):
    cache = getUserCacheRef(user_id)
    coords = getLocation(user_id) # user location        

    activeProfile = getActiveFoodProfile(user_id)
    if activeProfile:
        budget = activeProfile["budget"]
        distance = activeProfile["distance"]
    else:
        distance = int(cache.child("distanceCache").get()) # should be integer of meters
        budget = int(cache.child("budgetCache").get())

    yelp_results = getStore(coords, term = food_item, price=budget, radius=distance)

    # Parsing Yelp results to not include unnecessary/extra fields
    formatted_results = []
    # print(yelp_results["businesses"])
    for business in yelp_results["businesses"]:
        formatted_business = dict()
        formatted_business["name"] = business["name"]
        formatted_business["image_url"] = business["image_url"]
        formatted_business["distance"] = business["distance"]
        formatted_business["categories"] = business["categories"]
        formatted_business["location"] = business["location"]
        formatted_business["url"] = business["url"]
        formatted_results.append(formatted_business)

    clearCache(user_id)
    cache.update({"resultsCache" : json.dumps({"businesses":formatted_results})})