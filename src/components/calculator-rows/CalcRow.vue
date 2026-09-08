<script setup>
defineProps({
    label: {
        type: String,
        required: true,
        default: 'FILL ME'
    },
    isRequired: {
        type: Boolean,
        default: false
    }
});

</script>
<template>
    <div class="calc-row">
        <h5 class="row-label">
            {{ label }} 
            <span class="required-astr" v-if="isRequired">*</span>
        </h5>
        <slot />
    </div>
</template>
<style scoped>

.required-astr{
    color: var(--color-error)
}

</style>