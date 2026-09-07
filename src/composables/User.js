import { computed, onMounted, onUnmounted, ref } from "vue";
import UsersService from "../services/UsersService";

const user = ref(null);

const isLoggedIn = computed(() => !!user.value);

export function useUser(){

    async function login(email, password){
        let errorMessage = '';
        try{
            const authUser = await UsersService.login(email, password);
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
            const authError = await UsersService.register(email, password, username);
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
        await UsersService.logout();
    }

    async function getCurrentUser(){
        user.value = await UsersService.getCurrentUser();
    }

    return {
        user, isLoggedIn,
        login, signUp, logout, getCurrentUser
    };
}