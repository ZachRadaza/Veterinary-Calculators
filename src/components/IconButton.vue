<script setup>

defineProps({
    label: {
        type: String,
        default: ''
    },
    icon: {
        type: [Object, Function],
        required: true
    }
});

</script>
<template>
    <button>
        <component :is="icon" class="icon" />
        <span class="label">{{ label }}</span>
    </button>
</template>
<style scoped>

.icon{
    width: 1.5rem;
    height: auto;
}

</style>