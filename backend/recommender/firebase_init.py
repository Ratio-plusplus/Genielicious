# single script to handle connection/auth to database
# !sudo pip install firebase-admin
from firebase_admin import db, credentials, initialize_app
from dotenv import find_dotenv, load_dotenv
import os

dotenv_path = find_dotenv()
load_dotenv(dotenv_path) # loads env vars into path

cred = credentials.Certificate("backend\\recommender\\confidential\\serviceAccountKey.json")
db_url = {'databaseURL': os.getenv("DATABASE_URL")}

genie_app = initialize_app(cred, db_url)

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