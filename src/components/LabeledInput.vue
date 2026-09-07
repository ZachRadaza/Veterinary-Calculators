<script setup>

defineProps({
    label: {
        type: String,
        required: true,
        default: ''
    }, 
    error: {
        type: Boolean,
        default: false
    }
})

const input = defineModel();

</script>
<template>
    <div :class="`labeled-input ${error ? 'error' : ''}`">
        <h6 class="label">{{ label }}</h6>
        <input 
            v-model="input" 
            v-bind="$attrs"
        />
    </div>
</template>
<style scoped>

.labeled-input{
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    border: 0.1rem solid var(--color-primary);
    padding: 0.5rem 0.8rem;
    border-radius: 1rem;
    background: var(--color-bg);
}

.labeled-input :is(input, textarea){
    border: none;
    padding: 0;
    border-radius: 0;
    background: transparent;
}

.labeled-input:has(:is(input, textarea):focus){
    border-color: var(--color-secondary);
}

.labeled-input:has(:is(input, textarea):focus) .label{
    color: var(--color-secondary);
}

.labeled-input.error, 
.labeled-input:has(:is(input, textarea):user-invalid){
    border-color: var(--color-error);
}

</style>