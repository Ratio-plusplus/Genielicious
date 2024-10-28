import React, { useEffect } from 'react';
import { auth , database} from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential, updatePassword, sendEmailVerification, sendPasswordResetEmail} from "firebase/auth";
import { ref, set, getDatabase, get } from "firebase/database";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { REACT_APP_WEBCLIENTID } from '@env';
import { Image } from "react-native";


export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    //Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    //Send Email Verifcation to use
    await sendEmailVerification(user);
    
    //Save user information to database through backend
    const pfp = Image.resolveAssetSource(require("../assets/pfp.png"));
    const response = await fetch('http://10.0.2.2:5000/database/create_user',
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

