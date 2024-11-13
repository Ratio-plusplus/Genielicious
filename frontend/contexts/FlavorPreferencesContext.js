// FlavorPreferencesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Image } from 'react-native';
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
    const [mode, setMode] = useState("");


    const fetchProfiles = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/get_user_profile', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const json = await response.json();
            const info = json["profiles"];
            if (info) {
                const profilesArray = Object.keys(info).map((key) => ({
                    id: key,
                    ...info[key]
                }));
                setFlavorProfiles(profilesArray);
                console.log("profiles fetched");
            }
            else {
                setFlavorProfiles([]);
                console.log("No flavor profile")
            }
        } else {
            console.log("No user is signed in.");
        }
    }

    const updateProfile = async (profileId, updatedData) => {
        console.log(updatedData);
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/update_flavor_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ profileInfo: updatedData, profileId : profileId }),
                });
            const json = await response.json();
            console.log("Hi", json);
        } else {
            console.log("No user is signed in.");
        }
    }

    const addToProfile = async (name, selectedImage) => {
        if (currentUser) {
            idToken = await currentUser.getIdToken();
            const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/add_flavor_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ preferences: isChecked, name: name, photoURL: selectedImage }),
                });
            const json = await response.json();
            console.log("Hi", json);
        } else {
            console.log("No user is signed in.");
        }
    };

    const resetPreferences = () => {
        setIsChecked(defaultPreferences);
    }
    useEffect(() => {
        if (!loading) {
            fetchProfiles(); // Only fetch data when loading is false
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
            mode,
            setMode
        }}>
            {children}
        </FlavorPreferencesContext.Provider>
    );
};
