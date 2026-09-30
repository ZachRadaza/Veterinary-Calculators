<script setup>
import { ref } from 'vue';
import LabeledInput from '../components/LabeledInput.vue';
import { useUser } from '../composables/User.js';
import AuthTemplate from '../components/AuthTemplate.vue';

const user = useUser();

const loading = ref(false);
const errorMessage = ref('');
const onEmailRequest = ref(true);

const email = ref('');
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
        title="Reset Password"
        @submit="forgetPassword"
        :error-message
    >
        <!-- TODO: when hosted, -->
        <template v-if="onEmailRequest">
            <LabeledInput 
                v-model="email"
                label="Email"
                type="email"
                class="long"
                placeholder="coolio@gmail.com"
                required
            />

            <div v-if="showForgetPasswordMsg" class="flex-col email-sent-cont">
                <h6>An email was sent with instructions.</h6>
                <h6>Email may potentially be in spam folder.</h6>
            </div>

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
        </template>

        <template v-else>
            <!-- confrim password stuff-->
        </template>
    </AuthTemplate>
</template>
<style scoped>

.email-sent-cont.flex-col{
    gap: 0.5rem;
    text-align: center;
}

</style>