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
    <button type="button" class="flex-row">
        <component :is="icon" class="icon" />
        <span class="label">{{ label }}</span>
    </button>
</template>
<style scoped>

button.flex-row{
    gap: 0.5rem;
}

button .icon{
    color: var(--color-bg);
    fill: var(--color-bg);
    stroke: var(--color-bg);
}

button:is(:hover, :focus) .icon{
    color: var(--color-primary);
    fill: var(--color-primary);
    stroke: var(--color-primary);
}

button:is(:disabled) .icon{
    color: var(--color-secondary);
    fill: var(--color-secondary);
    stroke: var(--color-secondary);
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