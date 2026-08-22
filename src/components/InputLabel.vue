<script setup>
import { verifyNumberInput } from '../utils/CalculatorUtils';

const { hasDefaultNumBoundsCheck } = defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    },
    error: {
        type: Boolean,
        default: false
    },
    hasDefaultNumBoundsCheck: {
        type: Boolean,
        default: true
    }
});

const inputModel = defineModel();

function handleInputChange(){
    if(hasDefaultNumBoundsCheck)
        inputModel.value = verifyNumberInput(inputModel?.value, 0, 10000000);
}

</script>
<template>
    <div class="input-label">
        <input 
            v-model="inputModel" 
            :class="`${error ? 'error' : ''}`"
            v-bind="$attrs"
            @input="handleInputChange"
        />
        <h6>{{ label }}</h6>
    </div>
</template>
<style scoped>

.input-label{
    display: flex;
    flex-direction: row;
    gap: 1ch;
    align-items: center;
}

.input-label.short input{
    width: 100px;
}

</style>