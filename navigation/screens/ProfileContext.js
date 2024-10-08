import React, { createContext, useState } from 'react';
import { Image } from 'react-native';

// Create the context
export const ProfileContext = createContext();

// Create a provider component
export const ProfileProvider = ({ children }) => {
    //Initalization for our inital values
    const [pfp, setpfp] = useState(Image.resolveAssetSource(require("../../assets/pfp.png")).uri);
    const [username, setUsername] = useState("Ratio++")
    //put in password eventually

    return (
        <ProfileContext.Provider value={{ pfp, setpfp, username, setUsername}}>
        {children}
        </ProfileContext.Provider>
    );
};
