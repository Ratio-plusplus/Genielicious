import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
    apiKey: "AIzaSyDtbQX4LhLqpnlZqitzSQzqUiMGJT7Q4Iw",
    authDomain: "genielicious-1229a.firebaseapp.com",
    databaseURL: "https://genielicious-1229a-default-rtdb.firebaseio.com/",
    projectId: "genielicious-1229a",
    storageBucket: "genielicious-1229a.appspot.com",
    messagingSenderId: "8294537978",
    appId: "1:8294537978:web:8fa725b288cbae0a30c743",
    measurementId: "G-SKQTG46PM9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };