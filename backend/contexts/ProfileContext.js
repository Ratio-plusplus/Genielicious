import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import {useAuth} from './AuthContext'
import { getDatabase, ref, onValue } from 'firebase/database';

// Create the context
export const ProfileContext = createContext();

// Create a provider component
export const ProfileProvider = ({ children }) => {
    //default values
    const defaultPfp = Image.resolveAssetSource(require("../../frontend/assets/pfp.png")).uri
    const defaultUsername = "Ratio++";

    //Initalization for our inital values
    const [pfp, setpfp] = useState(defaultPfp);
    const [username, setUsername] = useState(defaultUsername)

    const fetchData = async () => {
        const user = useAuth().currentUser;
        console.log(user);
        if (user) {
            const idToken = await user.getIdToken(true);
            console.log(idToken)
            const response = await fetch('http://10.0.2.2:5000/database/get_user_info',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    }
                });
            const json = await response.json();
            const info = json["info"]
            setUsername(info["Username"]);
            setpfp(info["photoURL"]);
            console.log("Response:", json);
        } else {
            console.log("No user is signed in.");
        }
    }

    return (
        <ProfileContext.Provider value={{ pfp, setpfp, username, setUsername, fetchData}}>
            {children}
        </ProfileContext.Provider>
    );
};
