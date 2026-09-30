<script setup>
import { ref } from 'vue';
import LabeledInput from '../components/LabeledInput.vue';
import { useUser } from '../composables/User.js';
import router from '../router/index.js';
import AuthTemplate from '../components/AuthTemplate.vue';

const user = useUser();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref('');

async function login(){
    loading.value = true;
    
    errorMessage.value = await user.login(email.value, password.value, rememberMe.value);
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
        title="Login"
        @submit="login"
        :errorMessage
    >
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

                <RouterLink to="/forget-password">Forget Password?</RouterLink>
            </div>
        </div>

        <div class="submit-btn-cont flex-col">
            <button 
                type="submit"
                :disabled="loading"
                id="login-btn"
            >
                Login
            </button>
            <p>Don't have an account? <RouterLink :to="{ path: '/signup', query: router.currentRoute.value.query }">Sign Up</RouterLink></p>
        </div>
    </AuthTemplate>
</template>
<style scoped>

.below-password{
    justify-content: space-between;
}

@media (max-width: 600px){
    .below-password{
        flex-direction: column;
    }
}

</style>