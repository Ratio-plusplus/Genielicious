# single script to handle connection/auth to database
# !sudo pip install firebase-admin
from firebase_admin import db, credentials, initialize_app
from dotenv import find_dotenv, load_dotenv
import os
from flask import Flask, request, jsonify

dotenv_path = find_dotenv()
load_dotenv(dotenv_path) # loads env vars into path

cred = credentials.Certificate("backend\\recommender\\confidential\\serviceAccountKey.json")
db_url = {'databaseURL': os.getenv("DATABASE_URL")}

genie_app = initialize_app(cred, db_url)

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

