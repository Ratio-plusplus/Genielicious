import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDtbQX4LhLqpnlZqitzSQzqUiMGJT7Q4Iw",
    authDomain: "genielicious-1229a.firebaseapp.com",
    projectId: "genielicious-1229a",
    appId: "1:8294537978:web:8fa725b288cbae0a30c743",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export { app, auth };

