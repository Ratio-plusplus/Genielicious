// FlavorPreferencesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../firebase/firebase';
import { ref, set, push, onValue } from 'firebase/database';
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
    const [activeProfileId, setActiveProfileId] = useState(null);
    const [mode, setMode] = useState("");


    const fetchProfiles = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('http://10.0.2.2:5000/database/get_user_profile', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const json = await response.json();
            const info = json["profiles"];
            const profilesArray = Object.keys(info).map((key) => ({
                id: key,
                ...info[key]
            }));
            setFlavorProfiles(profilesArray);
            console.log("profiles fetched");
        } else {
            console.log("No user is signed in.");
        }
    }

    const updateProfile = async (profileId, updatedData) => {
        console.log(updatedData);
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('http://10.0.2.2:5000/database/update_flavor_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ profileInfo: updatedData, profileId : profileId }),
                });
            const json = await response.json();
            console.log(json)
        } else {
            console.log("No user is signed in.");
        }
    }

    const addToProfile = async (name, selectedImage) => {
        if (currentUser) {
            idToken = await currentUser.getIdToken();
            console.log(isChecked);
            const response = await fetch('http://10.0.2.2:5000/database/add_flavor_profile',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ preferences: isChecked, name: name, photoURL: selectedImage }),
                });
            const json = await response.json();
            console.log(json);
        } else {
            console.log("No user is signed in.");
        }
    };

    const resetPreferences = () => {
        setIsChecked(defaultPreferences);
    }

    const fetchActiveProfileId = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            try {
                const response = await fetch('http://10.0.2.2:5000/database/get_active_profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                console.log('Getting response: ', response.ok);

                if (response.ok) {
                    const data = await response.json();
                    setActiveProfileId(data.activeProfileId); // Set the active profile ID
                } else {
                    const errorText = await response.text();
                    console.error("Error fetching active profile ID: ", errorText);
                }
            } catch (error) {
                console.error("Error fetching active profile ID: ", error);
            }
        } else {
            console.log("No user is signed in.");
        }
    };

    useEffect(() => {
        if (!loading && currentUser) {
            console.log("Fetching profiles and active profile ID");
            const initializeData = async () => {
                await fetchProfiles();
                await fetchActiveProfileId();
            };
            initializeData();
        }
    }, [loading, currentUser]);

    const setActiveProfile = (profileId) => {
        setActiveProfileId(profileId);
    }

    const updateActiveProfileInFirebase = async (profileId) => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            try {
                const response = await fetch('http://10.0.2.2:5000/database/set_active_profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({ profileId })
                });

                if (response.ok) {
                    console.log("Active profile updated in Firebase successfully.");
                    setActiveProfileId(profileId); // Update local state
                } else {
                    const errorText = await response.text();
                    console.error("Error updating active profile in Firebase: ", errorText);
                }
            } catch (error) {
                console.error("Error updating active profile in Firebase: ", error);
            }
        } else {
            console.log("No user is signed in.");
        }
    };

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
            setMode,
            activeProfileId,
            setActiveProfile,
            updateActiveProfileInFirebase
        }}>
            {children}
        </FlavorPreferencesContext.Provider>
    );
};
