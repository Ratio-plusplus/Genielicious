import firebase_admin
from firebase_admin import credentials, db
import os

def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate("confidential\\serviceAccountKey.json")
        db_url = {'databaseURL': os.getenv("REACT_APP_FIREBASE_DATABASE_URL")}

        firebase_admin.initialize_app(cred, db_url)