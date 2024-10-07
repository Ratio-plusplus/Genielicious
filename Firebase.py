# imports firebase and connects our code via private key
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db



#create and save data
ref = db.reference('py/')
flavorProfile_ref = ref.child('flavorProfiles')
flavorProfile_ref.set({
    'profileName': {
        'allergiesOrRestrictions': "Here if any",
        'distance': "Here if any",
        'tastePreference': "Here if any",
        'budget': 800
    }
})

#test to see if I can read the data
handle = db.reference('py/flavorProfiles/profileName')
print(ref.get())