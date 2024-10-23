# single script to handle connection/auth to database
# !sudo pip install firebase-admin
from asyncio.windows_events import NULL
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
    except auth.InvalidTokenError:
        return None
def getTestUser(user_id):
    return db.reference(f"test_users/{user_id}")

def getUser(user_id):
    return db.reference(f"users/{user_id}")
# def changeID(this, that):
#     user = db.reference(f"test_users/{this}")
#     test_keys = db.reference(f"test_users/")

#     old_data = user.get()

#     test_keys.update({
#         that:old_data
#     })
#     user.delete()
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

        db.reference(f"users/{uid}").set({'Username': username, 'photoURL': image})
        return jsonify({"uid": uid, "message": "User created successfully in database"}), 200
    except Exception as e:
        return jsonify(message=f"Error with code: {e}")

def updateDatabaseUser(query):
    try:
        token = query.get("idToken")
        uid = verify_id_token(token)
        if uid:
            username = query.get("username")
            photoURL = query.get("photoURL")
            db.reference(f"users/{uid}").set({'Username': username, 'photoURL': photoURL})
            return jsonify({"uid": uid, "message": "User updated successfully in database"}), 200
        else:
            return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        return jsonify({"Error": e}), 400

def getTestUser(user_id):
    return db.reference(f"test_users/{user_id}")

def getUser(user_id):
    return db.reference(f"users/{user_id}")

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