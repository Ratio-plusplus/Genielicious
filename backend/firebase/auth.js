import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    //save username to realtime database
    await set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email,
    });

    return userCredential
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInPopup(auth, provider);
    //result.user
    return result;
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
