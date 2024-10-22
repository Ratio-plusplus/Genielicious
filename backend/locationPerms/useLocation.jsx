import * as Location from "expo-location";
import React, { useState } from "react";

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");

    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        const yes = 1;

        if(status !== 'granted'){
            Console.log(yes)
        }
    }



}

export default useLocation;