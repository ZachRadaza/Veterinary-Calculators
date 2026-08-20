<script setup>
import { computed, onMounted } from 'vue';
import DialogInfo from '../dialogs/DialogInfo.vue';
import CalcRow from './CalcRow.vue';
import { useInvalidInputDialog } from '../../composables/InvalidInputDialog.js';

const { label } = defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    },
    options: {
        type: Array,
        required: true,
        default: []
    },
    defaultOptionLabel: {
        type: String,
        default: ''
    },
    showError: {
        type: Boolean,
        default: false
    },
    postOptionText: {
        type: String,
        default: ''
    }
});

const selectModel = defineModel();

const isInvalid = computed(() => selectModel.value <= 0);

const invalidInputDialog = useInvalidInputDialog(isInvalid, label);

onMounted(() => {
    invalidInputDialog.init();
});

</script>
<template>
    <CalcRow :label="label">
        <select 
            v-model="selectModel" 
            :class="`${showError ? 'error' : ''}`" 
            v-bind="$attrs"
        >
            <option v-if="defaultOptionLabel" :value="0">{{ defaultOptionLabel }}</option>
            <option v-for="op in options" :key="op" :value="op">{{ op }} {{ postOptionText }}</option>
        </select>

        <DialogInfo
            :ref="invalidInputDialog?.dialogRef"
            title="Incomplete Input"
            :descriptions="[invalidInputDialog.dialogLabel.value]"
        />
    </CalcRow>
</template>
<style scoped>
</style>