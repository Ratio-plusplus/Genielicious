import React, { useEffect } from 'react';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential, updatePassword, sendEmailVerification, sendPasswordResetEmail, deleteUser} from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { REACT_APP_WEBCLIENTID } from '@env';
import { Image } from "react-native";


export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    //Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    //Send Email Verifcation to use
    const test = await sendEmailVerification(user);    
    //Save user information to database through backend
    const pfp = Image.resolveAssetSource(require("../assets/pfp.png"));
    const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/auth/create_user',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid: user.uid, username: username, email: email, pfp: pfp.uri}),
        });
    const json = await response.json();
    return user;
};

export const doSignInWithEmailAndPassword = async (email, password) => {

    const userCredential = await(signInWithEmailAndPassword(auth, email, password));
    currentuser = userCredential.user;
    return currentuser;
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

 export const doPasswordReset = (email) => {
     return sendPasswordResetEmail(auth, email);
 };

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const deleteAccount = async () => {
    idToken = await auth.currentUser.getIdToken();
    const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/delete_user',
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        });
    const json = await response.json();
    return json
};

export const deleteUserHistory = async () => {
    try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch('https://genielicious-1229a.wl.r.appspot.com/database/delete_history', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        });

        console.log("Checking response: ", response.ok)

        const json = await response.json(); // Parse the response as JSON

        console.log("Response Data:", json)

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to delete history');
        }

        return json; // Return the response data
    } catch (error) {
        console.error("Error deleting user history:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

