# single script to handle connection/auth to database
# !sudo pip install firebase-admin
from firebase_admin import auth, db, credentials, initialize_app
from dotenv import find_dotenv, load_dotenv
import os

dotenv_path = find_dotenv()
load_dotenv(dotenv_path) # loads env vars into path

cred = credentials.Certificate("Genielicious\\backend\\recommender\\confidential\\serviceAccountKey.json")
db_url = {'databaseURL': os.getenv("DATABASE_URL")}

genie_app = initialize_app(cred, db_url)
print(genie_app.name)  # "[DEFAULT]"
users = db.reference("users/9jdHehIN0JZP4UEiTSryshhxUJj1/flavorProfile/Image").get()
home = db.reference("/fake_keys/-O9bjjOeoP7w-665SWwp/")
home.set("another attribute to delete")
print(home.get())