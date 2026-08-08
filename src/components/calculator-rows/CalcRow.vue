<script setup>
defineProps({
    label: {
        type: String,
        required: true,
        default: 'FILL ME'
    },
});

</script>
<template>
    <div class="calc-row">
        <h5 class="row-label">{{ label }}</h5>
        <slot />
    </div>
</template>
<style>
</style>