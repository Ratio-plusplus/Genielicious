import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import {
    REACT_NATIVE_FIREBASE_API_KEY,
    REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
    REACT_NATIVE_FIREBASE_DATABASE_URL,
    REACT_NATIVE_FIREBASE_PROJECT_ID,
    REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
    REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
    REACT_NATIVE_FIREBASE_APP_ID,
    REACT_NATIVE_FIREBASE_MEASUREMENT_ID
} from '@env';

const firebaseConfig = {
    apiKey: REACT_NATIVE_FIREBASE_API_KEY,
    authDomain: REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_NATIVE_FIREBASE_DATABASE_URL,
    projectId: REACT_NATIVE_FIREBASE_PROJECT_ID,
    storageBucket: REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_NATIVE_FIREBASE_APP_ID,
    measurementId: REACT_NATIVE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app); //initialize realtime database
