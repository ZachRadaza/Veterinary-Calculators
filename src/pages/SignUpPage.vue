<script setup>
import { ref } from 'vue';
import LabeledInput from '../components/LabeledInput.vue';
import { useUser } from '../composables/User.js';
import { useRouter } from 'vue-router';

const user = useUser();
const router = useRouter();

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

    if(!errorMessage.value)
        router.push({ name: 'home' });
}

</script>
<template>
    <div class="form-wrapper flex-col">
        <h3>Create Account</h3>
        <form 
            @submit.prevent="signUp"
            class="flex-col"
        >

            <h6 
                v-if="errorMessage"
                class="error-text"
            >{{ errorMessage }}</h6>

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
                <p>Already have an account? <RouterLink to="/login">Login</RouterLink></p>
            </div>
        </form>
    </div>
</template>
<style scoped>

.form-wrapper{
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}

form{
    padding: 1rem;
    border: 0.1rem solid var(--color-secondary);
    border-radius: 2rem;
    background: var(--color-bg-secondary);
    gap: 1.5rem;
}

.submit-btn-cont{
    gap: 0;
    align-items: center;
    box-sizing: border-box;
}

.submit-btn-cont #create-account-btn{
    width: 90%;
    text-align: center;
}

.submit-btn-cont #create-account-btn:disabled{
    cursor: progress;
}

.below-password{
    justify-content: space-between;
}

.error-text{
    text-align: center;
    color: var(--color-error);
}

</style>