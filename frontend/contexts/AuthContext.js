//Will create authContext which encapsualtes all of the children

import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AppRegistry } from "react-native";
import { name as appName } from '../../app.json'


AppRegistry.registerComponent(appName, () => App);
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if (user) {
            setCurrentUser( user );
            setUserLoggedIn(true);
            console.log("Logged In");
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{currentUser, userLoggedIn, loading}}>
            {!loading && children }
        </AuthContext.Provider>
    )
}