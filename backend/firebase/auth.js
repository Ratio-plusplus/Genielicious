import React, { useEffect } from 'react';
import { auth , database} from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithCredential, updatePassword, sendEmailVerification, sendPasswordResetEmail} from "firebase/auth";
import { ref, set, getDatabase, get } from "firebase/database";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { REACT_APP_WEBCLIENTID } from '@env';
import { Image } from "react-native";


export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    const info = JSON.stringify({ email, password, username })
    console.log(info)
    const response = await fetch('http://10.0.2.2:5000/auth/create_user',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, password: password, username: username}),
        });
    console.log(response);
    const json = await response.json();
    console.log(json);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);

    //save username to realtime database
    await set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
        pfp: Image.resolveAssetSource("../../frontend/assets/pfp.png")
    }). then(() => {
        console.log("Data saved successfully!");
    }).catch((error) => {
        console.error("Error saving data:", error);
        throw error;
    });

    return userCredential
};

export const doSignInWithEmailAndPassword = async (email, password) => {

    const userCredential = await(signInWithEmailAndPassword(auth, email, password));
    currentuser = userCredential.user;
    console.log(userCredential.user);
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

