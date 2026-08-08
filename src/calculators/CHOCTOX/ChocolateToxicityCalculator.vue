<script setup>
import { ref, watch } from 'vue';
import CalcRow from '../../components/calculator-rows/CalcRow.vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import InputLabel from '../../components/InputLabel.vue';
import { ChocolateTypes } from './ChocolateTypes.js';
import { ChocQuantityUnits } from './ChocQuantityUnits.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import { usePatient } from '../../composables/Patient.js';
import { lbsToKg, roundToThousandth, verifyNumberInput } from '../../utils/CalculatorUtils.js';
import { useCalculator } from '../../composables/Calculator.js';
import ChocolateToxicityHelper from './ChocolateToxicityHelper.js';

const patient = usePatient();
const calculator = useCalculator();

const chocolateType = ref(0);
const otherCocoaContent = ref('0');
const quantity = ref('0');
const quantityUnit = ref(ChocQuantityUnits.OZ);
const results = ref(null);

watch(() => chocolateType.value, (chocType) => {
    if(chocType === ChocolateTypes.COCOAOTHER)
        otherCocoaContent.value = '0';
});

function handleOtherCocoaChange(){
    otherCocoaContent.value = verifyNumberInput(otherCocoaContent.value, 0, 100);
}

function handleQuantityChange(){
    quantity.value = verifyNumberInput(quantity.value, 0, 100000);
}

function calculate(){
    calculator.showResults.value = false;
    calculator.showErrors.value = true;
    
    if(!patient.validateInputtedPatient())
        return;

    if(chocolateType.value <= 0)
        return;

    if(chocolateType.value === ChocolateTypes.COCOAOTHER && otherCocoaContent.value <= 0)
        return;

    if(quantity.value <= 0 || quantityUnit.value <= 0)
        return;

    const patientEntered = patient.inputtedPatient?.value;
    const weightKg = lbsToKg(patientEntered?.weight);
    results.value = ChocolateToxicityHelper.calculateChocolateToxicity(
        weightKg, 
        chocolateType.value, 
        Number(quantity.value), 
        quantityUnit.value,
        Number(otherCocoaContent.value)
    );

    calculator.showResults.value = true;
}

function reset(){
    patient.resetInputtedPatient();
    calculator.resetCalculator();

    quantity.value = '0';
    otherCocoaContent.value = '0';
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowPatientWeight />

        <CalcRow label="Type of Chocolate: ">
            <select 
                v-model="chocolateType" 
                :class="`${calculator.showErrors.value && chocolateType <= 0 ? 'error' : ''}`"
            >
                <option :value="0">-- Select Chocolate Type --</option>
                <option v-for="choc in Object.values(ChocolateTypes)" :key="choc" :value="choc">{{ choc }}</option>
            </select>
        </CalcRow>

        <CalcRow label="Enter Cocoa Content: " v-if="chocolateType === ChocolateTypes.COCOAOTHER">
            <InputLabel 
                label="%" 
                v-model="otherCocoaContent" 
                class="short"
                @input="handleOtherCocoaChange"
                :error="calculator.showErrors && otherCocoaContent <= 0"
            />
        </CalcRow>

        <CalcRow label="Quantity: ">
            <div class="flex-row">
                <input 
                    v-model="quantity" 
                    :class="`short ${calculator.showErrors.value && quantity <= 0 ? 'error' : ''}`" 
                    @input="handleQuantityChange"
                />
                <select 
                    v-model="quantityUnit" 
                    :class="`short ${calculator.showErrors.value && quantityUnit <= 0 ? 'error' : ''}`" 
                >
                    <option v-for="unit in Object.values(ChocQuantityUnits)" :key="unit" :value="unit">{{ unit }}</option>
                </select>
            </div>
        </CalcRow>

        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>
        <template #results>
            <h5>Dogs Toxicity Level: {{ results?.toxicity?.level }} - {{ results?.toxicity?.label }}</h5>
            <h6>Estimated methylxanthine concentration: {{ roundToThousandth(results?.methylxanthineMgG) || 0 }} mg/g</h6>
            <h6>Total methylxanthines ingested: {{ roundToThousandth(results?.totalMethylxanthineMg) || 0}} mg</h6>
            <h6>Methylxanthine exposure: {{ roundToThousandth(results?.methylxanthineMgKg) || 0 }} mg/kg</h6>
        </template>
    </CalculatorTemplate>
</template>
<style>
</style>