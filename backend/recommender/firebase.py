# single script to handle connection/auth to database
# !sudo pip install firebase-admin
from enum import verify
from firebase_admin import db, credentials, initialize_app, auth
#from dotenv import find_dotenv, load_dotenv
import os
from flask import jsonify
import json
import ast

#dotenv_path = find_dotenv()
#load_dotenv(dotenv_path) # loads env vars into path

#cred = credentials.Certificate("confidential\\serviceAccountKey.json")

db_url = {'databaseURL': os.getenv("DATABASE_URL")}
initialize_app(credentials.ApplicationDefault(), db_url) #credentials.ApplicationDefault()

def verify_id_token(idToken):
    try:
        decoded_token = auth.verify_id_token(idToken)
        uid = decoded_token['uid']
        return uid
    except auth.InvalidIdTokenError:
        print("Invalid ID token")
        return None
    except auth.ExpiredIdTokenError:
        print("Expired ID token")
        return None
    except Exception as e:
        print(f"Error verifying ID token: {str(e)}")
        return None

#region Inner Region: Recommender Methods
def getTestUser(user_id):
    return db.reference(f"test_users/{user_id}")


# pulls user location from phone
def setUserLocation(query, uid):
    latitude = query.get("latitude")
    longitude = query.get("longitude")
    try:
        db.reference(f"users/{uid}/location").set({'latitude': latitude, 'longitude': longitude})
        return jsonify({"uid": uid, "message": "User location updated successfully in database"}), 200
    except Exception as e:
        return jsonify({"Error": e}), 400
        
def getTestUserCacheRef(user_id):
    return db.reference(f"test_users/{user_id}/cache")

# reference to data collection() in database
def getDataRef():
    return db.reference("/data")

# reference to yelp data
def getYelpDataRef():
    return db.reference("/yelp_data")

def changeTestUserID(this:str, that:str):
    user = db.reference(f"test_users/{this}")
    test_keys = db.reference(f"test_users/")

    old_data = user.get()

    test_keys.update({
        that:old_data
    })
    user.delete()

#endregion Inner Region

#region Inner Region: User Info Methods
def createNewUser(query):
    try:
        uid = query.get("uid")
        username = query.get("username")
        image = query.get("pfp")
        db.reference(f"users/{uid}").set({
            'username': username,
            'history' : "",
            'activeFoodProfileID': "None",
            "flavorProfiles" : {},
            'cache' : {
                "distanceCache": "",
                "surveyCache": "",
                "budgetCache": "",
                "resultsCache": ""
        },  "location" : {
                "latitude": 0,
                "longitude": 0
        },
            'photoURL': image
        })
        return jsonify({"uid": uid, "message": "User created successfully in database"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")
    
# gives tuple of user's preferred location coordinates    
def getLocation(user_id):
    latitude = db.reference(f"users/{user_id}/location/latitude").get()
    longitude = db.reference(f"users/{user_id}/location/longitude").get()
    return (latitude, longitude)

def getTestLocation(user_id):
    latitude = db.reference(f"test_users/{user_id}/location/latitude").get()
    longitude = db.reference(f"test_users/{user_id}/location/longitude").get()
    return (latitude, longitude)

def getUserRef(user_id):
    return db.reference(f"users/{user_id}")

def getUserCacheRef(user_id):
    return db.reference(f"users/{user_id}/cache")

def getUser(uid):
    try:
        info = db.reference(f"users/{uid}").get()
        return jsonify({"info": info})
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")


def updateDatabaseUser(query, uid):
    try:
        keys = query.keys()
        print(keys)
        for key in keys:
            print(key)
            print(query.get(key))
            db.reference(f"users/{uid}").update({key: query.get(key) })
        return jsonify({"uid": uid, "message": "User updated successfully in database"}), 200
    except Exception as e:
        return jsonify({"Error": e}), 400

def getResultsCache(uid):
    try:
        info = db.reference(f"users/{uid}/cache")
        return jsonify({"info": info.child("resultsCache").get()}), 200
    except Exception as e:
        print(e)
        return jsonify(message=f"Error with code: {e}")


def addHistory(query, uid):
    try:
        restaurantsInfo = query.get("restaurantsInfo")
        loading = json.loads(str(restaurantsInfo))
        categories = db.reference("yelp_data/categorized_aliases").get();
        for restaurant in loading:
            taste = restaurant['taste']
            alias = taste.split(", ")
            #x = ""
            tastes = set()
            for i in alias:
                if i in categories:
                    aliases = categories[i]
                    tastes.update(aliases)
                else:
                    print(i)
            x = ', '.join(map(str, tastes))
            restaurant['taste'] = x
            ref = db.reference(f"users/{uid}/history").push()
            ref.set(restaurant)
        return jsonify({"uid": uid, "message": "User added to history successfully added"}), 200
    except Exception as e:
        print(e)
        return jsonify(message=f"Error with code: {e}")

def getHistory(uid):
    try:
        info = db.reference(f"users/{uid}/history")
        return jsonify({"info": info.get()}), 200
    except Exception as e:
        print(e)
        return jsonify({"Error": e}), 400

def updateHistory(query, uid):
    try:
        restaurantsInfo = query.get("restaurantsInfo")
        restaurantId = query.get("restaurantId")
        name = restaurantsInfo["name"]
        taste = restaurantsInfo["taste"]
        image = restaurantsInfo["image"]
        address = restaurantsInfo["address"]
        distance = restaurantsInfo["distance"]
        favorite = restaurantsInfo["favorite"]
        ref = db.reference(f"users/{uid}/history/{restaurantId}")
        ref.update({
                "name" : name, 
                "image": image, 
                "distance" : distance,
                "favorite" : favorite,
                "taste" : taste,
                "address" : address,

                })
        return jsonify({"uid": uid, "message": "User added to history successfully added"}), 200
    except Exception as e:
        print(e)
        return jsonify(message=f"Error with code: {e}")

def deleteHistory(uid):
    pass

#endregion Inner Region

#region Inner Region: User Flavor Profile Methods
def getProfile(uid):
    try:
        if uid:
            info = db.reference(f"users/{uid}/flavorProfiles").get()
            return jsonify({"profiles": info})
        else:
            return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")

def updateFlavorProfile(query, uid):
    try:
            profileInfo = query.get("profileInfo")
            tastePreferences = profileInfo["tastePreferences"]
            allergies = profileInfo["allergies"]
            distance = profileInfo["distance"]
            budget = profileInfo["budget"]
            name = profileInfo["title"]
            photoURL = profileInfo["photoURL"]
            profileId = query.get("profileId")
            ref = db.reference(f"users/{uid}/flavorProfiles/{profileId}")
            ref.update({
                "title" : name, 
                "photoURL": photoURL, 
                "tastePreferences" : {
                        "savory": tastePreferences["savory"],
                        "sweet": tastePreferences["sweet"],
                        "salty": tastePreferences["salty"],
                        "spicy": tastePreferences["spicy"],
                        "bitter": tastePreferences["bitter"],
                        "sour": tastePreferences["sour"],
                        "cool": tastePreferences["cool"],
                        "hot": tastePreferences["hot"],
                    }, "allergies" : {
                        "vegan" : allergies["vegan"],
                        "vegetarian" : allergies["vegetarian"],
                        "peanut": allergies["peanut"],
                        "gluten": allergies["gluten"],
                        "fish": allergies["fish"],
                        "shellfish": allergies["shellfish"],
                        "eggs": allergies["eggs"],
                        "soy": allergies["soy"],
                        "dairy": allergies["dairy"],
                        "keto": allergies["keto"],
                        }, 
                "distance" : distance,
                "budget" : budget
                })
            return jsonify({"uid": uid, "message": "User flavor profile successfully created in database"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")

def addFlavorProfile(query, uid):
    try:
        if uid:
            profileInfo = query.get("preferences")
            tastePreferences = profileInfo["tastePreferences"]
            allergies = profileInfo["allergies"]
            distance = profileInfo["distance"]
            budget = profileInfo["budget"]
            name = query.get("name")
            photoURL = query.get("photoURL")
        
            ref = db.reference(f"users/{uid}/flavorProfiles")
            newref = ref.push()
            newref.set({
                "title" : name, 
                "photoURL": photoURL, 
                "tastePreferences" : {
                        "savory": tastePreferences["savory"],
                        "sweet": tastePreferences["sweet"],
                        "salty": tastePreferences["salty"],
                        "spicy": tastePreferences["spicy"],
                        "bitter": tastePreferences["bitter"],
                        "sour": tastePreferences["sour"],
                        "cool": tastePreferences["cool"],
                        "hot": tastePreferences["hot"],
                    }, "allergies" : {
                        "vegan" : allergies["vegan"],
                        "vegetarian" : allergies["vegetarian"],
                        "peanut": allergies["peanut"],
                        "gluten": allergies["gluten"],
                        "fish": allergies["fish"],
                        "shellfish": allergies["shellfish"],
                        "eggs": allergies["eggs"],
                        "soy": allergies["soy"],
                        "dairy": allergies["dairy"],
                        "keto": allergies["keto"],
                        }, 
                "distance" : distance,
                "budget" : budget
                })
            return jsonify({"uid": uid, "message": "User flavor profile successfully created in database"}), 200
        else:
            return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")

def deleteFlavorProfile(user_id, profile_id):
    try:
        ref = db.reference(f"users/{user_id}/flavorProfiles/{profile_id}")
        ref.delete()
        return jsonify({"message": "Flavor profile deleted successfully"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}"), 400
        
def deleteUserData(uid):
    try:
        auth.delete_user(uid)
        ref = db.reference(f"users/{uid}")
        ref.delete()
        return jsonify({"message": "User successfully deleted"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}"), 400
    except auth.AuthError as error:
        return jsonify(message=f"Error with auth: {e}"), 400
            
def submitBugReport(query, uid):
    try:
            title = query.get('bugReportTitle')
            urgency = query.get("urgency")
            description = query.get("description")
            ref = db.reference(f"bugReports/{uid}/problem")
            ref.set({
                "title" : title, 
                "urgency": urgency, 
                "description" : description,
            })
            return jsonify({"uid": uid, "message": "User bug report successfully created in database"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")

#endregion Inner Region

def setActiveProfile(user_id, profile_id):
    try:
        user_ref = db.reference(f"users/{user_id}")
        user_ref.update({
            'activeFoodProfileID': profile_id
        })
        return jsonify({"message": "Active profile updated successfully"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}"), 400

# return object (dict) of active food profile that contains all details and fields
def getActiveFoodProfile(user_id):
    activeID = db.reference(f"users/{user_id}/activeFoodProfileID").get()
    if not activeID:
        return None
    profile = db.reference(f"users/{user_id}/flavorProfiles/{activeID}").get()
    if profile:
        return profile
    else:
        return None
    
def getActiveProfileId(user_id):
    try:
        active_profile_id = db.reference(f"users/{user_id}/activeFoodProfileID").get()
        return jsonify({"activeProfileId": active_profile_id}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}"), 400

if __name__ == "__main__":
    import json
    user = getTestUser("3")
    print(user.child("flavorProfiles/0/title").get())