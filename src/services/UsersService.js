import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const USERS_COLLECTION = 'users';

const UsersService = {

    async register(email, password, username, rememberMe){
        if(!email || !password || !username)
            return null;

        await this.setAuthPersistence(rememberMe);

        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        await setDoc(doc(db, USERS_COLLECTION, result.user.uid), { 
            uid: user.uid,
            username, 
            email: user.email,
            createdAt: new Date()
        });

        return result.user;
    },

    async login(email, password, rememberMe){
        if(!email || !password)
            return null;

        await this.setAuthPersistence(rememberMe);

        const result = await signInWithEmailAndPassword(auth, email, password);

        return result.user;
    },

    async setAuthPersistence(rememberMe){
        const persistance = rememberMe
            ? browserLocalPersistence
            : browserSessionPersistence;

        await setPersistence(auth, persistance);
    },

    async logout(){
        await signOut(auth);
    },

    async getCurrentUser(){
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

};

export default UsersService;