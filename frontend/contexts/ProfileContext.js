// ProfileContext.js
import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useAuth } from './AuthContext'; // Import useAuth to get loading state and currentUser
import { getDatabase, ref, onValue } from 'firebase/database';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {

    const [pfp, setPfp] = useState("");
    const [username, setUsername] = useState("");
    
    const { currentUser, loading, userLoggedIn } = useAuth(); // Access currentUser and loading

    const fetchData = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
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
            if (userLoggedIn) {
            fetchData(); // Only fetch data when loading is false
            }
        }
    }, [loading, currentUser]); // Depend on loading and currentUser

    return (
        <ProfileContext.Provider value={{ pfp, setPfp, username, setUsername, fetchData }}>
            {children}
        </ProfileContext.Provider>
    );
};
