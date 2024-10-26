// FlavorPreferencesContext.js
import React, { createContext, useState } from 'react';
import { auth, database } from '../../backend/firebase/firebase';
import { ref, set, push, onValue } from 'firebase/database';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export const FlavorPreferencesContext = createContext();

export const FlavorPreferencesProvider = ({ children }) => {
    const defaultPreferences = {
        tastePreferences: {
            savory: false, 
            sweet: false, 
            salty: false, 
            spicy: false,
            bitter: false, 
            sour: false, 
            cool: false, 
            hot: false
        },
        allergies: {
            vegan: false, 
            vegetarian: false, 
            peanut: false, 
            gluten: false, 
            fish: false,
            shellfish: false, 
            eggs: false, 
            soy: false, 
            dairy: false, 
            keto: false
        },
        distance: {
            ten: false,
            fifteen: false,
            twenty: false,
        },
        budget: {
            dollar20: false,
            dollar50: false,
        },
        Title: {
            name: ""
        },
        Image: {
            ImageUri: Image.resolveAssetSource(require('../../frontend/assets/pfp.png'))
        }
    };

    const [isChecked, setIsChecked] = useState(defaultPreferences);
    const [flavorProfiles, setFlavorProfiles] = useState([]);

    const fetchProfiles = async () => {
        const user = auth.currentUser;
        if (user) {
            idToken = await user.getIdToken(true);
            //const profilesRef = ref(database, 'users/' + user.uid + "/flavorProfiles");

            //onValue(profilesRef, (snapshot) => {
            //    const data = snapshot.val();
            //    console.log("Data fetched from Firebase:", data);
            //    if (data) {
            //        const profilesArray = Object.keys(data).map((key) => ({
            //            id: key,
            //            ...data[key]
            //        }));
            //        console.log("Fetched profiles: ", profilesArray);
            //        setFlavorProfiles(profilesArray);
            //    } else {
            //        console.log("No profiles found in database");
            //        setFlavorProfiles([]);
            //    }
            //})
            const response = await fetch('http://10.0.2.2:5000/database/get_user_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken: idToken }),
                });
            const json = await response.json();  
            const info = json["profiles"]
            //const profilesArray = 
            console.log("Response:", json);

        } else {
            console.log("No user is signed in.");
        }
    }

    const updateProfile = async (profileId, updatedData) => {
        const user = auth.currentUser;
        if(user) {
            const profileRef = ref(database, `users/${user.uid}/flavorProfiles/${profileId}`);
            await set(profileRef, updatedData);
            console.log("Profile Updated successfully");
        } else {
            console.log("No user is signed in.");
        }
    }

    const addToProfile = async (name, selectedImage) => {
        const user = auth.currentUser
        if (user) {
            idToken = await user.getIdToken(true);
            const response = await fetch('http://10.0.2.2:5000/database/add_flavor_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : idToken
                    },
                    body: JSON.stringify({ preferences: isChecked, name: name, photoURL: selectedImage }),
                });
            const json = await response.json();  
            //const profileRef = ref(database, 'users/' + user.uid + "/flavorProfiles");
            //const newProfileRef = push(profileRef)
            //console.log("Is Checked:" , isChecked);
            //await set(newProfileRef, {
            //    Title: name,
            //    Image: selectedImage,
            //    tastePreferences: {
            //        savory: isChecked.tastePreferences.savory,
            //        sweet: isChecked.tastePreferences.sweet,
            //        salty: isChecked.tastePreferences.salty,
            //        spicy: isChecked.tastePreferences.spicy,
            //        bitter: isChecked.tastePreferences.bitter,
            //        sour: isChecked.tastePreferences.sour,
            //        cool: isChecked.tastePreferences.cool,
            //        hot: isChecked.tastePreferences.hot,
            //    },
            //    allergies: {
            //        vegan: isChecked.allergies.vegan,
            //        vegetarian: isChecked.allergies.vegetarian,
            //        peanut: isChecked.allergies.peanut,
            //        gluten: isChecked.allergies.gluten,
            //        fish: isChecked.allergies.fish,
            //        shellfish: isChecked.allergies.shellfish,
            //        eggs: isChecked.allergies.eggs,
            //        soy: isChecked.allergies.soy,
            //        dairy: isChecked.allergies.dairy,
            //        keto: isChecked.allergies.keto,
            //    },
            //    distance: isChecked.distance,
            //    budget: isChecked.budget
            //})

        } else {
            console.log("No user is signed in.");
        }
    };

    const resetPreferences = () => {
        setIsChecked(defaultPreferences);
    }

    return (
        <FlavorPreferencesContext.Provider value={{ 
            isChecked, 
            setIsChecked, 
            addToProfile, 
            resetPreferences, 
            fetchProfiles, 
            flavorProfiles,
            updateProfile,
        }}>
            {children}
        </FlavorPreferencesContext.Provider>
    );
};
