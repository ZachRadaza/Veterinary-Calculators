<script setup>
import ArrowIcon from '../assets/icon/ArrowIcon.vue';
import HomeIcon from '../assets/icon/HomeIcon.vue';
import router from '../router';
import IconButton from './IconButton.vue';

defineProps({
    title: {
        type: String,
        required: true,
        default: 'Add TItle'
    },
    errorMessage: {
        type: String,
        required: true,
        default: ''
    }
});

const emit = defineEmits(['submit']);

function goBack(){
    router.push({ path: router.currentRoute.value.query.redirect });
}

function goHome(){
    router.push({ name: 'home' })
}

</script>
<template>
    <div class="form-wrapper flex-col">
        <h3>{{ title }}</h3>
        <form 
            @submit.prevent="emit('submit')"
            class="flex-col auth-form"
        >

            <h6 
                v-if="errorMessage"
                class="error-text"
            >
                {{ errorMessage }}
            </h6>

            <slot />

        </form>
        <div class="navigation-row flex-row">
            <IconButton
                @click="goBack"
                label="Back"
                :icon="ArrowIcon"
                class="flex-row"
                :disabled="!router?.currentRoute?.value?.query?.redirect"
            />
            <IconButton
                @click="goHome"
                label="Home"
                :icon="HomeIcon"
            />
        </div>
    </div>
</template>
<style>

.form-wrapper{
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.auth-form{
    padding: 1rem;
    border: 0.1rem solid var(--color-secondary);
    border-radius: 2rem;
    background: var(--color-bg-secondary);
    gap: 1.5rem;
}

.auth-form .submit-btn-cont{
    gap: 0.5rem;
    align-items: center;
    box-sizing: border-box;
}

.auth-form button[type="submit"]{
    width: 90%;
    text-align: center;
}

.auth-form button[type="submit"]:disabled{
    cursor: progress;
}

.auth-form .below-password{
    justify-content: space-between;
}

.auth-form .error-text{
    text-align: center;
    color: var(--color-error);
}

.navigation-row{
    width: 100%;
    justify-content: space-around;
}

@media (max-width: 600px){
    .auth-form .below-password{
        flex-direction: column;
    }
}

</style>