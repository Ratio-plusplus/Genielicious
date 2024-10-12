import React, { createContext, useEffect, useState } from 'react';
import { Image } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

// Create the context
export const ProfileContext = createContext();

// Create a provider component
export const ProfileProvider = ({ children }) => {
    //default values
    const defaultPfp = Image.resolveAssetSource(require("../assets/pfp.png")).uri
    const defaultUsername = "Ratio++";

    //Initalization for our inital values
    const [pfp, setpfp] = useState(defaultPfp);
    const [username, setUsername] = useState(defaultUsername)
    
    //fetch user profile from realtime database
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid);

            //listen for changes in the user's data
            const unsubscribe = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    if (data.username && data.username !== defaultUsername) {
                        setUsername(data.username);
                    }
                    if (data.photoURL && data.photoURL !== defaultPfp) {
                        setpfp(data.photoURL);
                    }
                }
            }, (error) => {
                console.error("Error fetching user data:", error);
            });

            //Cleanup subscription on unmount
            return () => unsubscribe();
        }
    }, []);

    return (
        <ProfileContext.Provider value={{ pfp, setpfp, username, setUsername}}>
        {children}
        </ProfileContext.Provider>
    );
};
