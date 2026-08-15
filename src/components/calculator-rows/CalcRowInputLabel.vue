<script setup>
import { computed, onMounted } from 'vue';
import DialogInfo from '../dialogs/DialogInfo.vue';
import InputLabel from '../InputLabel.vue';
import CalcRow from './CalcRow.vue';
import { useInvalidInputDialog } from '../../composables/InvalidInputDialog.js';

const { label, error } = defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    },
    inputLabel: {
        type: String,
        required: true,
        default: '-'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    }
});

const isInvalid = computed(() => error);

const invalidInputDialog = useInvalidInputDialog(isInvalid, label);

onMounted(() => {
    invalidInputDialog.init();
});

const inputModel = defineModel();
</script>
<template>
    <CalcRow :label="label">
        <InputLabel 
            :label="inputLabel" 
            v-model="inputModel" 
            :disabled="disabled" 
            :error="error"
            :class="`${$attrs.class}`"
            @input="$attrs.onInput"
        />
        
        <DialogInfo 
            :ref="invalidInputDialog.dialogRef"
            title="Incomplete Input"
            :descriptions="[invalidInputDialog.dialogLabel.value]"
        />
    </CalcRow>
</template>
<style scoped>
</style>