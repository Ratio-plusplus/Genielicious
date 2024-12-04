// ProfileContext.js
import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useAuth } from './AuthContext'; // Import useAuth to get loading state and currentUser
import * as Location from "expo-location";


export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {

    const [pfp, setPfp] = useState("");
    const [username, setUsername] = useState("");
    const [filterFavs, setFilterFavs] = useState(false);
    const { currentUser, loading, userLoggedIn } = useAuth(); // Access currentUser and loading
    const [location, setLocation] = useState({});

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
    const getUserLocation = async () => {
        // Just uses expo-location to grab location and print it as coordinates
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status);
        if (status !== 'granted') {
            setErrorMsg('Permission to location not granted')
            console.log('Perms not granted!')
            return;
        }

        // Once permissions are grabbed, get coords but in a tuple
        let { coords } = await Location.getCurrentPositionAsync();
        console.log("Coords:", coords);
        if (coords && currentUser) {
            const { latitude, longitude } = coords;
            console.log('lat and long: ', latitude, longitude);
            let location = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
            console.log('User location is: ', location);
            const idToken = await currentUser.getIdToken();
            const response = await fetch(`https://genielicious-1229a.wl.r.appspot.com/database/get_location`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                }, body: JSON.stringify({ latitude: latitude, longitude: longitude })
            });
            if (response.ok) {
                const json = await response.json();
                console.log(json);
            } else {
                const json = await response.text();
                console.log(json);
            }
            setLocation({latitude: latitude, longitude: longitude})
        };
    };
    useEffect(() => {
        if (!loading) {
            if (userLoggedIn) {
                fetchData(); // Only fetch data when loading is false
                getUserLocation();
            }
        }
    }, [loading, currentUser]); // Depend on loading and currentUser

    return (
        <ProfileContext.Provider value={{ pfp, setPfp, username, setUsername, fetchData, location, setLocation, filterFavs, setFilterFavs, getUserLocation }}>
            {children}
        </ProfileContext.Provider>
    );
};
