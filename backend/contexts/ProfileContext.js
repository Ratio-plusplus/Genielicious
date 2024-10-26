import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { getAuth } from '@firebase/auth';
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
        const auth = getAuth();
        const user = auth.currentUser;
        const idToken = await user.getIdToken(true);
        console.log(idToken);
        if (user) {
            console.log("Inside User");
            const response = await fetch('http://10.0.2.2:5000/database/get_user_info',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken: idToken }),
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
