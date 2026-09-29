<script setup>
import { ref } from 'vue';
import LabeledInput from '../components/LabeledInput.vue';
import { useUser } from '../composables/User.js';
import router from '../router/index.js';

const user = useUser();

const email = ref('');
const loading = ref(false);
const errorMessage = ref('');
const showForgetPasswordMsg = ref(false);

async function forgetPassword(){
    loading.value = true;

    errorMessage.value = await user.forgetPassword(email.value);
    loading.value = false;

    if(!errorMessage.value)
        showForgetPasswordMsg.value = true;
}

</script>
<template>
<div class="form-wrapper flex-col">
        <h3>Forget Password?</h3>
        <form 
            @submit.prevent="forgetPassword"
            class="flex-col"
        >

            <h6 
                v-if="errorMessage"
                class="error-text"
            >
                {{ errorMessage }}
            </h6>

            <LabeledInput 
                v-model="email"
                label="Email"
                type="email"
                class="long"
                placeholder="coolio@gmail.com"
                required
            />

            <h6 v-if="showForgetPasswordMsg">An email was sent with instructions.</h6>

            <div class="submit-btn-cont flex-col">
                <button 
                    type="submit"
                    :disabled="loading"
                    id="send-email-btn"
                >
                    Send Email Reset Link
                </button>
                <p>Have an account? <RouterLink :to="{ path: '/login' }">Login</RouterLink></p>
            </div>
        </form>
        <div class="navigation-row flex-row">
            <RouterLink :to="{ path: router.currentRoute.value.query.redirect }">Back</RouterLink>
            <RouterLink :to="{ name: 'home' }">Home</RouterLink>
        </div>
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
    gap: 0.5rem;
    align-items: center;
    box-sizing: border-box;
}

.submit-btn-cont #send-email-btn{
    width: 90%;
    text-align: center;
}

#send-email-btn:disabled{
    cursor: progress;
}

.error-text{
    text-align: center;
    color: var(--color-error);
}

.navigation-row{
    width: 100%;
    justify-content: space-around;
}
</style>