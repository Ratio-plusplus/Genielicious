// FlavorPreferencesContext.js
import React, { createContext, useState } from 'react';
import { auth, database } from '../../backend/firebase/firebase';
import { ref, set } from 'firebase/database';
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

    const addToProfile = async (name, selectedImage) => {
        const user = auth.currentUser
        if (user) {
            await set(ref(database, 'users/' + user.uid + "/flavorProfile/tastePreference"), {
                savory: isChecked.tastePreferences.savory,
                sweet: isChecked.tastePreferences.sweet,
                salty: isChecked.tastePreferences.salty,
                spicy: isChecked.tastePreferences.spicy,
                bitter: isChecked.tastePreferences.bitter,
                sour: isChecked.tastePreferences.sour,
                cool: isChecked.tastePreferences.cool,
                hot: isChecked.tastePreferences.hot,
            });

            await set(ref(database, 'users/' + user.uid + "/flavorProfile/allergies"), {
                vegan: isChecked.allergies.vegan,
                vegetarian: isChecked.allergies.vegetarian,
                peanut: isChecked.allergies.peanut,
                gluten: isChecked.allergies.gluten,
                fish: isChecked.allergies.fish,
                shellfish: isChecked.allergies.shellfish,
                eggs: isChecked.allergies.eggs,
                soy: isChecked.allergies.soy,
                dairy: isChecked.allergies.dairy,
                keto: isChecked.allergies.keto,
            });

            await set(ref(database, 'users/' + user.uid + "/flavorProfile/Distance"), {
                //pushing distance
                ten: isChecked.distance.ten,
                fifteen: isChecked.distance.fifteen,
                twenty: isChecked.distance.twenty,
            });
            
            await set(ref(database, 'users/' + user.uid + "/flavorProfile/Budget"), {
                //pushing budget
                dollar20: isChecked.budget.dollar20,
                dollar50: isChecked.budget.dollar50,
            });

            await set(ref(database, 'users/' + user.uid + "/flavorProfile/Title"), {
                Title: name,
            });

            await set(ref(database, 'users/' + user.uid + "/flavorProfile/Image"), {
                imageUri: selectedImage,
            });

            console.log("Preferences saved successfully");
        } else {
            console.log("No user is signed in.");
        }
    };

    const resetPreferences = () => {
        setIsChecked(defaultPreferences);
    }

    return (
        <FlavorPreferencesContext.Provider value={{ isChecked, setIsChecked, addToProfile, resetPreferences }}>
            {children}
        </FlavorPreferencesContext.Provider>
    );
};
