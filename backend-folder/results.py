from firebase import getUserCacheRef, getActiveFoodProfile, getLocation, addHistory
# from firebase import getTestUserCacheRef, getTestLocation
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
    # status values will let the frontend know what type of results are given
    # codes are as follows:
    #   1 : successful/normal results
    #   2 : exact results weren't found so "next best" results were given
    #   3 : no results could be found for one reason or another 
    #       ex: there are no OPEN businesses that are also on yelp around the user
    #       ex: there are no restaurants around that are similar enough
    status = 1
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
    # print(yelp_results)
    
    if "businesses" not in yelp_results:
        error = {"error": {"type":500,"message":"Yelp businesses not provided"}}
        print(error)
        cache.update({"resultsCache" : json.dumps(error)})
        return error

    total = yelp_results.get("businesses",0)

    # handle when no businesses are given
    if total == 0:
        status = 2
        # broaden search parameters a bit
        yelp_results = getStore(coords, term = food_item.split(" ")[0:2], categories="food",price=budget, radius=distance)
        total = yelp_results.get("businesses",0)

    # check if there are any new results
    if total == 0:
        status = 3

    # Parsing Yelp results to not include unnecessary/extra fields
    formatted_results = []
    for business in yelp_results["businesses"]:
        formatted_business = dict()
        formatted_business["id"] = business["id"]
        formatted_business["name"] = business["name"]
        formatted_business["image_url"] = business["image_url"]
        formatted_business["distance"] = business["distance"]
        formatted_business["categories"] = business["categories"]
        formatted_business["location"] = business["location"]
        formatted_business["url"] = business["url"]
        formatted_business["coordinates"] = business["coordinates"]
        formatted_results.append(formatted_business)

    clearCache(user_id)
    cache.update({"resultsCache" : json.dumps({"businesses":formatted_results,
                                               "result_status":status})})