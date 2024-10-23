import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
            setErrorMsg('Permission to location not granted')
            console.log('Perms not granted!')
            return;
        }

        let {coords} = await Location.getCurrentPositionAsync();

        if(coords) {
            const { latitude, longitude } = coords;
            console.log('lat and long: ', latitude, longitude);
            setLatitude(latitude);
            setLongitude(longitude);
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
        
            console.log('User location is: ', response);
        };
    };


    useEffect(() => {
        getUserLocation();
    }, [])



    return {latitude, longitude, errorMsg}; 
}

export default useLocation;