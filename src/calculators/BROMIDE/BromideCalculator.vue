<script setup>
import { computed, ref, watch } from 'vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { BromideCompoundChoices } from './BromideCompoundChoices.js';
import InputLabel from '../../components/InputLabel.vue';
import { KbrConcentrationOptions } from './KBrConcentrationOptions.js';
import { KbrTotalLoad } from './KbrTotalLoad.js';
import { DaysToLoad } from './DaysToLoad.js';
import { NumberOfDoses } from './NumberOfDoses.js';
import { NaBrTotalLoad } from './NaBrTotalLoad.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import { usePatient } from '../../composables/Patient.js';
import { useCalculator } from '../../composables/Calculator.js';
import BromideHelper from './BromideHelper.js';
import { lbsToKg, roundToThousandth } from '../../utils/CalculatorUtils.js';
import CalcRow from '../../components/calculator-rows/CalcRow.vue';
import CalcRowTwoOptions from '../../components/calculator-rows/CalcRowTwoOptions.vue';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';

const patient = usePatient();
const calculator = useCalculator();

const selectedCompound = ref(BromideCompoundChoices.KBR);
const sharedData = ref({
    takingPhenobarbital: false,
    totalLoad: 0,
    daysLoad: 0,
    numDoses: 0
});
const kbrData = ref({
    concentration: KbrConcentrationOptions.ML,
    mgMl: 250,
    mgTablet: 200,
    takingRectally: false,
});
const naBrData = ref({
    concentrationML: 250 
});
const resultValues = ref(null);

const selectedTotalLoads = computed(() => {
    const loadsByCompound = {
        [BromideCompoundChoices.KBR]: KbrTotalLoad,
        [BromideCompoundChoices.NABR]: NaBrTotalLoad
    };

    return loadsByCompound[selectedCompound.value] ?? [];
});
const showTakingPhenoberbital = computed(() => 
    (selectedCompound.value === BromideCompoundChoices.KBR && !kbrData.value.takingRectally) || 
    selectedCompound.value === BromideCompoundChoices.NABR
);
const showTakingRectally = computed(() => 
    selectedCompound.value === BromideCompoundChoices.KBR && 
    kbrData.value.concentration === KbrConcentrationOptions.ML
);
const showTakingRectallyText = computed(() =>
    showTakingRectally.value &&
    kbrData.value.takingRectally
);
const showTotalLoadError = computed(() => 
    calculator.showErrors.value && sharedData.totalLoad?.value === 0
);
const showDaysLoadError = computed(() => 
    calculator.showErrors.value && sharedData.daysLoad?.value === 0
);
const showDosesPerDayError = computed(() => 
    calculator.showErrors.value && sharedData.numDoses?.value <= 0
);


watch(() =>  kbrData.value.takingRectally, (rectally) => {
    if(rectally){
        sharedData.value.totalLoad = 600;
        sharedData.value.daysLoad = 1;
        sharedData.value.numDoses = 6;
    } else {
        sharedData.value.totalLoad = 0;
        sharedData.value.daysLoad = 0;
        sharedData.value.numDoses = 0;
    }
});

watch(() => kbrData.value.concentration, (conc) => {
    if(conc !== KbrConcentrationOptions.TABlET)
        kbrData.value.takingRectally = false;
})

function calculate(){
    calculator.startCalculator();

    if(!patient.validateInputtedPatient())
        return;

    if((!kbrData.value.mgMl || !kbrData.value.mgTablet) && selectedCompound.value === BromideCompoundChoices.KBR)
        return;

    if(naBrData.value.concentrationML <= 0 && selectedCompound.value === BromideCompoundChoices.NABR)
        return;

    if(sharedData.value.daysLoad <= 0 || sharedData.value.numDoses <= 0 || sharedData.value.totalLoad <= 0)
        return;

    const weightKg = lbsToKg(patient.inputtedPatient?.value?.weight ?? 0);
    let result = null;

    switch(selectedCompound.value){
        case BromideCompoundChoices.KBR:
            result = BromideHelper.calculateKbr(weightKg, sharedData.value, kbrData.value);
            break;
        case BromideCompoundChoices.NABR:
            result = BromideHelper.calculateNaBrLiquid(weightKg, sharedData.value, naBrData.value);
            break;
    }

    resultValues.value = result;
    calculator.endCalculator();
}

function reset(){
    patient.resetInputtedPatient();

    sharedData.value = {
        takingPhenobarbital: false,
        totalLoad: 0,
        daysLoad: 0,
        numDoses: 0
    };

    kbrData.value = {
        concentration: KbrConcentrationOptions.ML,
        mgMl: 250,
        mgTablet: 200,
        takingRectally: false,
    };

    naBrData.value = { concentrationML: 250 };

    calculator.resetCalculator();
}

</script>
<template>
<CalculatorTemplate>
    <CalcRowPatientWeight />

    <CalcRow class="nabr-kbr-choice-row" label="Choice of Inorganic Chemical Compounds: ">
        <div class="radio-col">
            <label v-for="comp in Object.values(BromideCompoundChoices)" :key="comp">
                <input type="radio" :value="comp" v-model="selectedCompound"/> {{ comp }}
            </label>
        </div>
    </CalcRow>

    <!-- KBr stuff-->
    <CalcRow label="KBr Concentration: " v-if="selectedCompound === BromideCompoundChoices.KBR">
        <div class="kbr-selection flex-col">
            <div class="radio-div">
                <input type="radio" :value="KbrConcentrationOptions.ML" v-model="kbrData.concentration" /> 
                <InputLabel 
                    label="mg/ml" 
                    class="short" 
                    v-model="kbrData.mgMl"
                    :disabled="kbrData.concentration !== KbrConcentrationOptions.ML"
                    :error="calculator.showErrors && kbrData.mgMl <= 0"
                />
            </div>
            <h6> - OR - </h6>
            <div class="radio-div">
                <input type="radio" :value="KbrConcentrationOptions.TABlET" v-model="kbrData.concentration"/> 
                <InputLabel 
                    label="mg/tablet" 
                    class="short" 
                    v-model="kbrData.mgTablet" 
                    :disabled="kbrData.concentration !== KbrConcentrationOptions.TABlET"
                    :error="calculator.showErrors && kbrData.mgTablet <= 0"
                />
            </div>
        </div>
    </CalcRow>

    <CalcRowTwoOptions
        label="Taking Rectally: "
        v-show="showTakingRectally"
        v-model="kbrData.takingRectally"
        :option1="{ value: true, label: 'Yes' }"
        :option2="{ value: false, label: 'No' }"
    />

    <!-- end-->

    <!-- NaBr stuff-->
    <CalcRowInputLabel 
        label="NaBr Concentration: "
        v-model="naBrData.concentrationML"
        v-if="selectedCompound === BromideCompoundChoices.NABR"
        input-label="mg/ml"
        :error="calculator.showErrors && naBrData.concentrationML <= 0"
        class="short"
    />
    <!--end-->

    <CalcRowTwoOptions
        label="Also Taking Phenobarbital: "
        v-show="showTakingPhenoberbital"
        v-model="sharedData.takingPhenobarbital"
        :option1="{ value: true, label: 'Yes' }"
        :option2="{ value: false, label: 'No' }"
    />

    <CalcRowSelect 
        label="Total Load:"
        v-model="sharedData.totalLoad"
        :options="selectedTotalLoads"
        default-option-label="Select a Dose"
        :show-error="showTotalLoadError"
        :disabled="showTakingRectallyText"
        post-option-text="mg/kg"
    />

    <CalcRowSelect 
        label="Days To Load: "
        v-model="sharedData.daysLoad"
        :options="!showTakingRectallyText ? DaysToLoad : [1]"
        default-option-label="Select Number of Days"
        :show-error="showDaysLoadError"
        :disabled="showTakingRectallyText"
        post-option-text="Days"
    />

    <CalcRowSelect 
        label="Number of Doses per Day: "
        v-model="sharedData.numDoses"
        :options="!showTakingRectallyText ? NumberOfDoses : [6]"
        default-option-label="Select Doses Per Day"
        :show-error="showDosesPerDayError"
        :disabled="showTakingRectallyText"
        post-option-text="Doses"
    />

    <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

    <template #results>
        <h5>{{ resultValues?.compound }} Loading Dose</h5>
        <h6>Dose: {{ roundToThousandth(resultValues?.doseMg) }} mg per dose</h6>
        <h6>Daily Dose: {{ roundToThousandth(resultValues?.dailyDoseMg) }} mg/day</h6>
        <h6>Total Loading Amount: {{ roundToThousandth(resultValues?.totalLoadMg) }} mg</h6>
        <h6>Concentration: {{ resultValues?.concentration }} {{ resultValues?.concentrationUnit }}</h6>
        <h6>Route: {{ resultValues?.dosageForm === 'liquid' ? 'Liquid' : 'Tablet' }}</h6>
    </template>
</CalculatorTemplate>
</template>
<style>
</style>