import React, { useEffect } from 'react';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { REACT_APP_WEBCLIENTID } from '@env';

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
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

/*
export const doSignOut = () => {
    return auth.SignOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.CurrentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUSer, { url: '${window.location.origin}/home', });
};
*/