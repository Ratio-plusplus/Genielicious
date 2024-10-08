import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };