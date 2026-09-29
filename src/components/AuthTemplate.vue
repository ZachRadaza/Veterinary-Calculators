<script setup>
import router from '../router';

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

</script>
<template>
    <div class="form-wrapper flex-col">
        <h3>{{ title }}</h3>
        <form 
            @submit.prevent="emit('submit')"
            class="flex-col"
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
            <RouterLink :to="{ path: router.currentRoute.value.query.redirect }">Back</RouterLink>
            <RouterLink :to="{ name: 'home' }">Home</RouterLink>
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

button[type="submit"]{
    width: 90%;
    text-align: center;
}

button[type="submit"]:disabled{
    cursor: progress;
}

.below-password{
    justify-content: space-between;
}

.error-text{
    text-align: center;
    color: var(--color-error);
}

.navigation-row{
    width: 100%;
    justify-content: space-around;
}

@media (max-width: 600px){
    .below-password{
        flex-direction: column;
    }
}

</style>