// ProfileContext.js
import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useAuth } from './AuthContext'; // Import useAuth to get loading state and currentUser

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {

    const [pfp, setPfp] = useState("");
    const [username, setUsername] = useState("");
    const [filter, setFilter] = useState({});
    const [filterFavs, setFilterFavs] = useState(false);
    const { currentUser, loading, userLoggedIn } = useAuth(); // Access currentUser and loading

    const fetchData = async () => {
        if (currentUser) {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/get_user_info', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const json = await response.json();
            const info = json["info"];
            setUsername(info["username"]);
            setPfp(info["photoURL"]);
            console.log("Success");
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
        <ProfileContext.Provider value={{ pfp, setPfp, username, setUsername, fetchData, filter, setFilter, filterFavs, setFilterFavs }}>
            {children}
        </ProfileContext.Provider>
    );
};
