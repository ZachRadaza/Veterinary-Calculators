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
    color: var(--color-text);
    fill: var(--color-text);
    stroke: var(--color-text);
}

button:is(:hover, :focus) .icon{
    color: var(--color-primary);
    fill: var(--color-primary);
    stroke: var(--color-primary);
}

button.secondary .icon{
    color: var(--color-primary);
    fill: var(--color-primary);
    stroke: var(--color-primary);
}

button.secondary:is(:hover, :focus) .icon{
    color: var(--color-bg);
    fill: var(--color-bg);
    stroke: var(--color-bg);
}

button.no-bg:is(:hover, :focus) .icon{
    color: var(--color-secondary);
    fill: var(--color-secondary);
    stroke: var(--color-secondary);
}

</style>