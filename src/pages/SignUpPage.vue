<script setup>
import { ref } from 'vue';
import LabeledInput from '../components/LabeledInput.vue';
import { useUser } from '../composables/User.js';
import router from '../router/index.js';
import AuthTemplate from '../components/AuthTemplate.vue';

const user = useUser();

const email = ref('');
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');
const loading = ref(false);

async function signUp(){
    loading.value = true;

    errorMessage.value = await user.signUp(email.value, password.value, username.value, rememberMe.value);
    loading.value = false;

    if(!errorMessage.value){
        const routeRedirect = router.currentRoute.value?.query?.redirect;
        routeRedirect 
            ? router.push({ path: router.currentRoute.value.query.redirect })
            : router.push({ name: 'home' });
    }
}

</script>
<template>
    <AuthTemplate
        title="Create Account"
        :error-message
        @submit="signUp"
    >

        <LabeledInput 
            v-model="username"
            label="Username"
            class="long"
            placeholder="CoolioJulio"
            required
        />

        <LabeledInput 
            v-model="email"
            label="Email"
            type="email"
            class="long"
            placeholder="coolio@gmail.com"
            required
        />

        <div class="flex-col">
            <LabeledInput 
                v-model="password"
                label="Password"
                type="password"
                class="long"
                placeholder="super secret password"
                required
            />
            <div class="below-password flex-row">
                <label>
                    <input type="checkbox" v-model="rememberMe"/>
                    Remember Me
                </label>
            </div>
        </div>

        <div class="submit-btn-cont flex-col">
            <button 
                type="submit"
                :disabled="loading"
                id="create-account-btn"
            >
                Create Account
            </button>
            <p>Already have an account? <RouterLink :to="{ path: '/login', query: router.currentRoute.value.query }">Login</RouterLink></p>
        </div>
    </AuthTemplate>
</template>
<style scoped>
</style>