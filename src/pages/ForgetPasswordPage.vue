<script setup>
import { ref } from 'vue';
import LabeledInput from '../components/LabeledInput.vue';
import { useUser } from '../composables/User.js';
import AuthTemplate from '../components/AuthTemplate.vue';

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
    <AuthTemplate
        title="Forget Password"
        @submit="forgetPassword"
        :error-message
    >
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
    </AuthTemplate>
</template>
<style scoped>
</style>