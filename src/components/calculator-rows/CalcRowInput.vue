<script setup>
import { computed, onMounted } from 'vue';
import { useInvalidInputDialog } from '../../composables/InvalidInputDialog';
import { verifyNumberInput } from '../../utils/CalculatorUtils';
import CalcRow from './CalcRow.vue';
import DialogInfo from '../dialogs/DialogInfo.vue';

const { hasDefaultNumBoundsCheck, error, label } = defineProps({
    label: {
        type: String,
        default: '-',
        required: true
    },
    error: {
        type: Boolean,
        default: false,
    },
    hasDefaultNumBoundsCheck: {
        type: Boolean,
        default: true,
    }
})

const inputModel = defineModel();
const invalidInput = computed(() => error);
const invalidInputDialog = useInvalidInputDialog(invalidInput, label);

function handleInputChange(){
    if(hasDefaultNumBoundsCheck)
        inputModel.value = verifyNumberInput(inputModel?.value, 0, 10000000);
}

onMounted(() => {
    invalidInputDialog.init();
});

</script>
<template>
    <CalcRow :label="label">
    
        <input 
            v-model="inputModel"
            v-bind="$attrs"
            :class="`${error ? 'error' : ''} ${$attrs.class}`"
            @input="handleInputChange"
        />
    

        <DialogInfo 
            :ref="invalidInputDialog.dialogRef"
            :title="`Incomplete Input`"
            :descriptions="[invalidInputDialog.dialogLabel.value]"
        />
    </CalcRow>
</template>
<style scoped>
</style>