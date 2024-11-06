# single script to handle connection/auth to database
# !sudo pip install firebase-admin
from enum import verify
from firebase_admin import db, credentials, initialize_app, auth
from dotenv import find_dotenv, load_dotenv
import os
from flask import Flask, request, jsonify   

dotenv_path = find_dotenv()
load_dotenv(dotenv_path) # loads env vars into path

cred = credentials.Certificate("confidential\\serviceAccountKey.json")
db_url = {'databaseURL': os.getenv("REACT_APP_FIREBASE_DATABASE_URL")}
initialize_app(cred, db_url)

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
def setUserLocation(uid):
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
                #     await set(ref(database, 'users/' + user.uid), {
        #     username: username,
        #     email: email,
        #     pfp: Image.resolveAssetSource("../../frontend/assets/pfp.png")
        # }). then(() => {
        #     console.log("Data saved successfully!");
        # }).catch((error) => {
        #     console.error("Error saving data:", error);
        #     throw error;
        # });

        db.reference(f"users/{uid}").set({'Username': username, 'photoURL': image, "distanceCache": "", "surveyCache": "", "budgetCache": "", "resultsCache": "", "location" : {"latitude": 0, "longitude": 0}})
        return jsonify({"uid": uid, "message": "User created successfully in database"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")

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

# def changeID(this, that):
#     user = db.reference(f"test_users/{this}")
#     test_keys = db.reference(f"test_users/")

#     old_data = user.get()

#     test_keys.update({
#         that:old_data
#     })
#     user.delete()

def updateFlavorProfile(query, uid):
    try:
            profileInfo = query.get("profileInfo");
            tastePreferences = profileInfo["tastePreferences"]
            allergies = profileInfo["allergies"]
            distance = profileInfo["distance"]
            budget = profileInfo["budget"]
            name = profileInfo["title"]
            photoURL = profileInfo["photoURL"]
            profileId = query.get("profileId")
            ref = db.reference(f"users/{uid}/flavorProfiles/{profileId}")
            ref.set({
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
            newref = ref.push();
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
            
#endregion Inner Region

if __name__ == "__main__":
    import json

    file_path = r"backend\recommender\unused\important_food_categories.json"

    with open(file_path, "r") as file:
        json_ob = json.load(file)

    yelp_data = db.reference("/test_users/3")
    yelp_data.update({
        "flavorProfiles" : [
            {
                "image" : "some_image_idk",
                "title" : "healthy",
                "allergies" : {
                    "dairy" : False,
                    "eggs": False,
                    "fish": False,
                    "gluten":True,
                    "keto" : False,
                    "peanut": False,
                    "shellfish": False,
                    "soy": False,
                    "vegan" : False,
                    "vegetarian": True
                }
            }
        ]
    })