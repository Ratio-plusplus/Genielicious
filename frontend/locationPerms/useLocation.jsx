import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    {/* Requests user lcocation by Foreground for constant access*/}
    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();

        // Checks if location is not provided 
        if(status !== 'granted'){
            setErrorMsg('Permission to location not granted');
            return;
        }

        {/* Sets location so that longitude and latitude */}
        try { 
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

            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 100000 },
                (location) => {
                    console.log(location);
                }
            );
            };
            //try and catch so that it will ask every time userLocation is invoked if location is not accessed
        } catch (error) {
            // Handle errors
            setErrorMsg(error.message);
            console.error('Error starting foreground location tracking:', error);
          }
    };


    useEffect(() => {
        getUserLocation();
    }, [])



    return {latitude, longitude, errorMsg}; 
}

export default useLocation;