import React, { useEffect } from 'react';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential, updatePassword } from "firebase/auth";
import { ref, set, getDatabase, get } from "firebase/database";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { REACT_APP_WEBCLIENTID } from '@env';
import { Image } from "react-native";


export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    const database = getDatabase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("User ID:", user.uid)

    //save username to realtime database
    await set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
    }). then(() => {
        console.log("Data saved successfully!");
    }).catch((error) => {
        console.error("Error saving data:", error);
        throw error;
    });

    return userCredential
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    const database = getDatabase();
    const userCredential = await(signInWithEmailAndPassword(auth, email, password))
    user = userCredential.user;
    /*
    //console.log("User ID:", user.uid)

    //const userRef = ref(database, 'users/' + user.uid);
    //const snapshot = await get(userRef);

    //let userData = null;
    if (snapshot.exists()) {
        userData = snapshot.val();
        console.log("User Data:", userData);
    } else {
        console.log("No user data found");
    }
    */
    return user;
    
};

export const doSignInWithGoogle = async () => {
    GoogleSignin.configure({
        webClientId: REACT_APP_WEBCLIENTID, // Replace with your actual Web Client ID from Firebase
    });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const loggedIn = await GoogleSignin.signIn();
    const UseridToken = loggedIn.data.idToken
    const googleCredential = GoogleAuthProvider.credential(UseridToken);
    return signInWithCredential(auth, googleCredential);
};

export const doSignOut = () => {
    return auth.signOut();
};

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// };

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, { url: '${window.location.origin}/home', });
// };
