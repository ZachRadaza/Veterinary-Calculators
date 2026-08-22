<script setup>
import { computed, onMounted } from 'vue';
import CalcRow from './CalcRow.vue';
import InputLabel from '../InputLabel.vue';
import DialogInfo from '../dialogs/DialogInfo.vue';
import { verifyNumberInput } from '../../utils/CalculatorUtils';
import { useInvalidInputDialog } from '../../composables/InvalidInputDialog.js';

const { 
    errorInput, 
    errorSelect, 
    label, 
    hasDefaultNumBoundsCheck, 
    onInput 
} = defineProps({
    label: {
        type: String,
        required: true,
        default: ''
    },
    errorInput: {
        type: Boolean,
        default: false
    },
    errorSelect: {
        type: Boolean,
        default: false
    },
    hasDefaultNumBoundsCheck: {
        type: Boolean,
        default: true,
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
    postOptionText: {
        type: String,
        default: ''
    },
    classInput: {
        type: String,
        default: ''
    },
    classSelect: {
        type: String,
        default: ''
    },
    onInput: {
        type: Function,
        default: () => {}
    }
});

const isInputInvalid = computed(() => errorInput);
const isSelectInvalid = computed(() => errorSelect);

const invalidInputDialog = useInvalidInputDialog(isInputInvalid, label);
const invalidSelectDialog = useInvalidInputDialog(isSelectInvalid, label);

onMounted(() => {
    invalidInputDialog.init();
    invalidSelectDialog.init();
});

const input = defineModel('input');
const select = defineModel('select');

function handleInputChange(){
    if(hasDefaultNumBoundsCheck)
        input.value = verifyNumberInput(input?.value, 0, 10000000);

    onInput();
}
</script>
<template>
    <CalcRow :label="label">
        <div class="flex-row">
            <input 
                v-model="input" 
                :class="`${isInputInvalid ? 'error' : ''} ${classInput}`"
                @input="handleInputChange"
            />
            
            <select 
                v-model="select" 
                :class="`${isSelectInvalid ? 'error' : ''} ${classSelect}`" 
            >
                <option v-if="defaultOptionLabel" :value="0">{{ defaultOptionLabel }}</option>
                <option v-for="op in options" :key="op" :value="op">{{ op }} {{ postOptionText }}</option>
            </select>
        </div>

        <!-- DIalogs -->
        <DialogInfo
            :ref="invalidInputDialog.dialogRef"
            title="Incomplete Input"
            :descriptions="[invalidInputDialog.dialogLabel.value]"
        />

        <DialogInfo
            :ref="invalidSelectDialog?.dialogRef"
            title="Incomplete Input"
            :descriptions="[invalidSelectDialog.dialogLabel.value]"
        />
    </CalcRow>
</template>
<style scoped>
</style>