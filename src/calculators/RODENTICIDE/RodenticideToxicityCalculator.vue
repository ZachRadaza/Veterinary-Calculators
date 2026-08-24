<script setup>
import { ref } from 'vue';
import CalcRowPatientSpecies from '../../components/calculator-rows/CalcRowPatientSpecies.vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalcRowRadios from '../../components/calculator-rows/CalcRowRadios.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { RodenticideTypes } from './RodenticideTypes.js';
import CalcRowInputSelect from '../../components/calculator-rows/CalcRowInputSelect.vue';
import { useCalculator } from '../../composables/Calculator.js';
import { ChocQuantityUnits } from '../CHOCTOX/ChocQuantityUnits.js';
import { RodenticideTimeIngestion } from './RodenticideTimeIngestion.js';
import { usePatient } from '../../composables/Patient.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import { lbsToKg, roundToThousandth } from '../../utils/CalculatorUtils.js';
import RodenticideHelper from './RodenticideHelper.js';

const calculator = useCalculator();
const patient = usePatient();

const rodenticideType = ref(Object.keys(RodenticideTypes)[0]);
const quantityBait = ref({
    amount: 0,
    unit: ChocQuantityUnits.GM
});
const ingestion = ref(RodenticideTimeIngestion.LESS);

const result = ref(null);

function calculate(){
    calculator.startCalculator();

    if(!patient.validateInputtedPatient())
        return;

    if(quantityBait.value?.amount <= 0)
        return;

    const weightKg = lbsToKg(patient.inputtedPatient.value?.weight);

    result.value = RodenticideHelper.calculateRodenticideDose(
        rodenticideType.value,
        patient.inputtedPatient.value?.species,
        weightKg,
        Number(quantityBait.value?.amount),
        quantityBait.value?.unit,
        ingestion.value
    );

    calculator.endCalculator();
}

function reset(){
    calculator.resetCalculator();
    patient.resetInputtedPatient();

    rodenticideType.value = Object.keys(RodenticideTypes)[0];
    quantityBait.value = {
        amount: 0,
        unit: ChocQuantityUnits.GM
    };
    ingestion.value = RodenticideTimeIngestion.LESS;
}

</script>
<template>
    <CalculatorTemplate>

        <CalcRowPatientSpecies :only-dog-cat="true"/>

        <CalcRowPatientWeight />

        <CalcRowRadios 
            label="Type of Rodenticide: "
            v-model="rodenticideType"
            :radio-options="Object.keys(RodenticideTypes)"
        />

        <CalcRowInputSelect 
            label="Quantity of Bait: "
            v-model:input="quantityBait.amount"
            v-model:select="quantityBait.unit"
            :error-input="calculator.showErrors.value && quantityBait.amount <= 0"
            :error-select="calculator.showErrors.value && quantityBait.unit === 0"
            :has-default-num-bounds-check="true"
            :options="Object.values(ChocQuantityUnits)"
            class-input="short"
            class-select="short"
        />

        <CalcRowRadios 
            label="Time Since Ingenstion: "
            v-model="ingestion"
            :radio-options="Object.values(RodenticideTimeIngestion)"
            :is-row="true"
        />

        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

        <template #results>
            <div class="flex-col">
                <h5>Dose: {{ roundToThousandth(result?.doseMgKg) }} mg/kg</h5>
                <h6>Active Ingredient: {{ roundToThousandth(result?.activeIngredientMg) }} mg</h6>
                <h6>Bait Consumed: {{ roundToThousandth(result?.baitGrams) }} g</h6>
                <h6>Assessment: {{ result?.severity }}</h6>
            </div>

            <div class="flex-col">
                <h5>Time Since Ingestion: {{ ingestion }}</h5>
                <h6>{{ result?.ingestionRecommendation }}</h6>
            </div>
        </template>
    </CalculatorTemplate>
</template>
<style scoped>

</style>