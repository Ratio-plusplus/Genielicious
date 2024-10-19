# imports firebase and connects our code via private key
import firebase_admin
import creds
import json
from firebase_admin import credentials
from firebase_admin import db


#Initialize Firebase
cred = credentials.Certificate(creds.certificateCredentials)
firebase_admin.initialize_app(cred, {'databaseURL': creds.databaseURL})


def newFlavorProfile():
    username = input("Enter your username: ")
    profileName = input("Enter your profile name: ")
    allergies = input("Enter your allergies: ")
    distance = input("Enter the distance you're willng to travel: ")
    tastePreference = input("Enter Taste Preference: ")
    budget = input("Enter your budget: ")

    #create and save data
    #add hash with username
    ref = db.reference(username) #username with hash
    flavorProfile_ref = ref.child('FlavorProfiles')
    flavorProfile_ref.push({
        profileName: {
            'allergiesOrRestrictions': allergies, #based on form, array
            'distance': distance, #based on form, array
            'tastePreference': tastePreference, #based on form, array
            'budget': budget #based on form, array 
        }
    })
    
def updateProfile():
    return 1


def menu():
    while True:
        options = int(input("Enter your option:\n1. New profile\n2. Update Profile\n 3. View Profile\n4. Quit"))

        if options == 1:
            newFlavorProfile()
        elif options == 2:
            updateProfile()
        elif options == 3:
            viewProfile()
        else:
            break

newFlavorProfile()
ref = db.reference("/")
print(ref.get())
