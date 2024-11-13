import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext'




const useLocation = async () => {
    {/* Used to store longitude and latitute, push to user*/ }
    const [errorMsg, setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const { currentUser } = useAuth(); // Access currentUser and loading

    const getUserLocation = async () => {
        // Just uses expo-location to grab location and print it as coordinates
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permission to location not granted')
            console.log('Perms not granted!')
            return;
        }

        // Once permissions are grabbed, get coords but in a tuple
        let { coords } = await Location.getCurrentPositionAsync();

        if (coords) {
            const { latitude, longitude } = coords;
            console.log('lat and long: ', latitude, longitude);
            setLatitude(latitude);
            setLongitude(longitude);
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
            setUserLocation(currentUser, latitude, longitude);

            console.log('User location is: ', response);
        };
    };
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`http://10.0.2.2:5000/database/get_location`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }, body: JSON.stringify({ latitude: latitude, longitude: longitude })
    });
    const json = await response.json();
    return { latitude, longitude, errorMsg };
};

export default useLocation;