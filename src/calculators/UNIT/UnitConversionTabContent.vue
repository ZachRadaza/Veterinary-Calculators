<script setup>
import { computed, ref } from 'vue';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import { UnitConversionTabs } from './UnitConversionTabs.js';
import { useCalculator } from '../../composables/Calculator.js';
import DialogInfo from '../../components/dialogs/DialogInfo.vue';

const { showTabErrors } = defineProps({
    units: {
        type: Object,
        required: true,
    },
    showTabErrors: {
        type: Boolean,
        required: true,
        default: false
    }
})

const calculator = useCalculator();

const sameUnitDialog = ref(null);

const amount = defineModel('amount');
const unitFrom = defineModel('unitFrom');
const unitTo = defineModel('unitTo');
const emitEvent = defineEmits(['calculate', 'reset']);

function calculate(){
    calculator.startCalculator();

    if(amount.value <= 0)
        return;

    if(unitFrom.value === unitTo.value){
        sameUnitDialog.value.openDialog();
        return;
    }

    emitEvent('calculate');

    calculator.endCalculator();
}

function reset(){
    calculator.resetCalculator();
    emitEvent('reset');
}

const amountError = computed(() => 
    amount.value <= 0 &&
    calculator.showErrors.value &&
    showTabErrors
);
const selectError = computed(() => 
    unitFrom.value === unitTo.value &&
    calculator.showErrors.value &&
    showTabErrors
);

</script>
<template>
    <CalcRowInputLabel
        label="Amount: "
        v-model="amount"
        :input-label="unitFrom"
        :has-default-num-bounds-check="true"
        :error="amountError"
        class="short"
    />

    <CalcRowSelect
        label="From: "
        v-model="unitFrom"
        :options="Object.keys(units)"
        :show-error="selectError"
        class="short"
    />

    <CalcRowSelect 
        label="To: "
        v-model="unitTo"
        :options="Object.keys(units)"
        :show-error="selectError"
        class="short"
    />

    <CalcRowCalculateBtns :calculate="calculate" :reset="reset" />

    <DialogInfo
        ref="sameUnitDialog"
        title="Same Units Selected"
        :descriptions="['Please select a different Unit to convert to.']"
    />
</template>
<style scoped>
</style>