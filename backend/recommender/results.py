from firebase_init import getTestUser
from yelp import getStore

def clearCache(user_id):
    user = getTestUser(user_id)
    user.update({
        "surveyCache" : "",
        "resultsCache" : ""
    })

    return f"Successfullly cleared cache from userID: {user_id}" # confirmation

def getResults(user_id):
    pass

def compileResults(results):
    # TODO use resultsCache from db to generate the yelp results
    pass