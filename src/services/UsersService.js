import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const USERS_COLLECTION = 'users';

export async function register(email, password, username, rememberMe){
    if(!email || !password || !username)
        return null;

    await setAuthPersistence(rememberMe);

    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(db, USERS_COLLECTION, result.user.uid), { 
        uid: user.uid,
        username, 
        email: user.email,
        createdAt: new Date()
    });

    return result.user;
}

export async function loginUser(email, password, rememberMe){
    if(!email || !password)
        return null;

    await setAuthPersistence(rememberMe);

    const result = await signInWithEmailAndPassword(auth, email, password);

    return result.user;
}

export async function setAuthPersistence(rememberMe){
    const persistance = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

    await setPersistence(auth, persistance);
}

export async function logoutUser(){
    await signOut(auth);
}

export async function getCurrentUser(){
    const authUser = auth.currentUser;

    if(!authUser)
        return null;

    const user = await getDoc(doc(db, USERS_COLLECTION, authUser.uid));

    if(!user.exists())
        return null;

    return {
        id: user.id,
        ...user.data()
    }
}

export async function forgetUserPassword(email){
    if(!email)
        return null;

    sendPasswordResetEmail(auth, email);
}