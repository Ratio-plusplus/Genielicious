// ProfileContext.js
import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useAuth } from './AuthContext'; // Import useAuth to get loading state and currentUser
import { getDatabase, ref, onValue } from 'firebase/database';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const defaultPfp = Image.resolveAssetSource(require("../../frontend/assets/pfp.png")).uri;
    const defaultUsername = "Ratio++";

    const [pfp, setPfp] = useState(defaultPfp);
    const [username, setUsername] = useState(defaultUsername);
    
    const { currentUser, loading } = useAuth(); // Access currentUser and loading

    const fetchData = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken(true);
            const response = await fetch('http://10.0.2.2:5000/database/get_user_info', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const json = await response.json();
            const info = json["info"];
            setUsername(info["Username"]);
            setPfp(info["photoURL"]);
        } else {
            console.log("No user is signed in.");
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchData(); // Only fetch data when loading is false
        }
    }, [loading, currentUser]); // Depend on loading and currentUser

    return (
        <ProfileContext.Provider value={{ pfp, setPfp, username, setUsername, fetchData }}>
            {children}
        </ProfileContext.Provider>
    );
};
