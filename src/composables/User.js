import { computed, ref } from "vue";
import { forgetUserPassword, getCurrentUser, loginUser, logoutUser, register } from "../services/UsersService";

const user = ref(null);

const isLoggedIn = computed(() => !!user.value);
const userId = computed(() => user.value?.id ?? '');

async function login(email, password){
    let errorMessage = '';
    try{
        const authUser = await loginUser(email, password);
    } catch(error){
        console.error('Error in logging in: ', error);
        
        switch(error.code){
            case 'auth/invalid-credential':
                errorMessage = 'Incorrect email or password.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Unable to connect. Check your internet connection.';
                break;
            default:
                errorMessage = error.message || 'Unable to log in.';
        }
    } finally{
        return errorMessage;
    }
}

async function signUp(email, password, username){
    let errorMessage = '';
    try{
        const authError = await register(email, password, username);
    } catch(error){
        console.error('Error in Creating Account: ', error);

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account already exists with this email.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password must be at least 6 characters.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email and password registration is not enabled.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Unable to connect. Check your internet connection.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Please try again later.';
                break;
            default:
                errorMessage = error.message || 'Unable to create your account.';
        }
    } finally{
        return errorMessage;
    }
}

async function logout(){
    await logoutUser();
}

async function loadCurrentUser(){
    user.value = await getCurrentUser();
}

async function forgetPassword(email){
    let errorMessage = '';
    try{
        if(!email){
            errorMessage = 'Please enter an email address'
            return errorMessage;
        }

        await forgetUserPassword(email);

    } catch(error){
        console.error(error);
    } finally{
        return errorMessage;
    }
}

export function useUser(){
    return {
        user, isLoggedIn, userId,
        login, signUp, logout, loadCurrentUser, forgetPassword
    };
}