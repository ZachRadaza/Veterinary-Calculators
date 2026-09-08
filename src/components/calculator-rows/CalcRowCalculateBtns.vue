<script setup>
import { ref } from 'vue';
import DialogBoolean from '../dialogs/DialogBoolean.vue';

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

const confirmDialog = ref(null);

</script>
<template>
    <div class="calculate-btns-row">
        <button @click="calculate">Calculate</button>
        <button @click="confirmDialog.openDialog" class="secondary">Reset</button>
    </div>

    <DialogBoolean 
        title="Confirm Reset"
        ref="confirmDialog"
        :descriptions="['Are you sure you want to reset inputs']"
        :option-true="{ text: 'Reset', action: reset }"
        :option-false="{ text: 'Cancel', action: () => {} }"
    />
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