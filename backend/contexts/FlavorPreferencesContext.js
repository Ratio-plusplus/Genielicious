// FlavorPreferencesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../../backend/firebase/firebase';
import { ref, set, push, onValue } from 'firebase/database';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {useAuth} from './AuthContext'

export const FlavorPreferencesContext = createContext();

export const FlavorPreferencesProvider = ({ children }) => {
        const { currentUser, loading } = useAuth(); // Access currentUser and loading
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
        distance: 0,
        budget: 0,
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
        if (currentUser) {
            const idToken = await currentUser.getIdToken(true);
            const response = await fetch('http://10.0.2.2:5000/database/get_user_profile', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const json = await response.json();
            const info = json["profiles"];
            console.log("Response:", info);
            const profilesArray = Object.keys(info).map((key) => ({
                id: key,
                ...info[key]
            }));
            console.log("Fetched profiles: ", profilesArray);
            setFlavorProfiles(profilesArray);
        } else {
            console.log("No user is signed in.");
        }
    }

    const updateProfile = async (profileId, updatedData) => {
        console.log(updatedData);
        if(currentUser) {
            const profileRef = ref(database, `users/${user.uid}/flavorProfiles/${profileId}`);
            await set(profileRef, updatedData);
            console.log("Profile Updated successfully");
        } else {
            console.log("No user is signed in.");
        }
        
        if (currentUser) {
            idToken = await currentUser.getIdToken(true);
            const response = await fetch('http://10.0.2.2:5000/database/add_flavor_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : idToken
                    },
                    body: JSON.stringify({ profileInfo: updatedData, profileId : profileId }),
                });
            const json = await response.json();
        } else {
            console.log("No user is signed in.");
        }
    }

    const addToProfile = async (name, selectedImage) => {
        if (currentUser) {
            idToken = await currentUser.getIdToken(true);
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
        } else {
            console.log("No user is signed in.");
        }
    };

    const resetPreferences = () => {
        setIsChecked(defaultPreferences);
    }
    useEffect(() => {
        console.log("Fetching...");
        if (!loading) {
            fetchProfiles(); // Only fetch data when loading is false
            console.log("Fetched");
        }
    }, [loading, currentUser]); // Depend on loading and currentUser

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
