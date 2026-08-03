<script setup>

defineProps({
    calculate: {
        type: Function,
        required: true,
        default: () => {}
    },
    reset: {
        type: Function,
        required: true,
        default: () => {}
    },
});

</script>
<template>
    <div class="calculate-btns-row">
        <button @click="calculate()">Calculate</button>
        <button @click="reset()" class="secondary">Reset</button>
    </div>
</template>
<style scoped>

.calculate-btns-row{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: center;
}

</style>