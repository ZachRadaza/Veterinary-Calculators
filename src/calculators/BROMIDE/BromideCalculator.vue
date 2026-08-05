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
    calculator.showResults.value = true;
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

    calculator.showResults.value = false;
}

</script>
<template>
<CalculatorTemplate>
    <CalcRowPatientWeight />

    <div class="calc-row nabr-kbr-choice-row">
        <h5 class="row-label">Choice of Inorganic Chemical Compounds: </h5>
        <div class="radio-col">
            <label v-for="comp in Object.values(BromideCompoundChoices)" :key="comp">
                <input type="radio" :value="comp" v-model="selectedCompound"/> {{ comp }}
            </label>
        </div>
    </div>

    <!-- KBr stuff-->
    <div class="calc-row" v-if="selectedCompound === BromideCompoundChoices.KBR">
        <h5 class="row-label">KBr Concentration: </h5>
        <div class="kbr-selection">
            <div class="radio-div">
                <input type="radio" :value="KbrConcentrationOptions.ML" v-model="kbrData.concentration" /> 
                <InputLabel 
                    label="mg/ml" 
                    class="short" 
                    v-model="kbrData.mgMl"
                    :disabled="kbrData.concentration !== KbrConcentrationOptions.ML"
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
                />
            </div>
        </div>
    </div>

    <div class="calc-row" v-if="selectedCompound === BromideCompoundChoices.KBR && kbrData.concentration === KbrConcentrationOptions.ML">
        <h5 class="row-label">Taking Rectally: </h5>
        <div class="radio-col">
            <label>
                <input type="radio" :value="true" v-model="kbrData.takingRectally"/> Yes
            </label>
            <label>
                <input type="radio" :value="false" v-model="kbrData.takingRectally"/> No
            </label>
        </div>
    </div>
    <!-- end-->

    <!-- NaBr stuff-->
    <div class="calc-row" v-if="selectedCompound === BromideCompoundChoices.NABR">
        <h5 class="row-label">NaBr Concentration: </h5>
        <InputLabel label="mg/ml" v-model="naBrData.concentrationML" class="short"/>
    </div>
    <!--end-->

    <div 
        class="calc-row" 
        v-if="
            (selectedCompound === BromideCompoundChoices.KBR && !kbrData.takingRectally) || 
            selectedCompound === BromideCompoundChoices.NABR
        "
    >
        <h5 class="row-label">Also Taking Phenobarbital: </h5>
        <div class="radio-col">
            <label>
                <input type="radio" :value="true" v-model="sharedData.takingPhenobarbital"/> Yes
            </label>
            <label>
                <input type="radio" :value="false" v-model="sharedData.takingPhenobarbital"/> No
            </label>
        </div>
    </div>

    <div class="calc-row">
        <h5 class="row-label">Total Load: </h5>
        <h5 v-if="kbrData.takingRectally && 
                selectedCompound === BromideCompoundChoices.KBR && 
                kbrData.concentration === KbrConcentrationOptions.ML
            ">{{ sharedData.totalLoad }} mg/kg</h5>
        <select v-else v-model="sharedData.totalLoad">
            <option :value="0">Select a Dose</option>
            <option
                v-for="load in selectedTotalLoads" 
                :value="load" 
                :key="load"
            >{{ load }} mg/kg</option>
        </select>
    </div>
    <div class="calc-row">
        <h5 class="row-label">Days To Load: </h5>
        <h5 v-if="kbrData.takingRectally && 
                selectedCompound === BromideCompoundChoices.KBR && 
                kbrData.concentration === KbrConcentrationOptions.ML
            "
        >{{ sharedData.daysLoad }} Day</h5>
        <select v-else v-model="sharedData.daysLoad">
            <option :value="0">Select Number of Days</option>
            <option v-for="days in DaysToLoad" :key="days" :value="days">{{ days }} Days</option>
        </select>
    </div>
    <div class="calc-row">
        <h5 class="row-label">Number of Doses per day: </h5>
        <h5 v-if="kbrData.takingRectally &&
                selectedCompound === BromideCompoundChoices.KBR &&
                kbrData.concentration === KbrConcentrationOptions.ML
        ">{{ sharedData.numDoses }} Doses Per Day</h5>
        <select v-else v-model="sharedData.numDoses">
            <option :value="0">Select Doses Per Day</option>
            <option v-for="doses in NumberOfDoses" :key="doses" :value="doses">{{ doses }} Doses</option>
        </select>
    </div>

    <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

    <template #results>
        <h5>{{ resultValues.compound }} Loading Dose</h5>
        <h6>Dose: {{ roundToThousandth(resultValues.doseMg) }} mg per dose</h6>
        <h6>Daily Dose: {{ roundToThousandth(resultValues.dailyDoseMg) }} mg/day</h6>
        <h6>Total Loading Amount: {{ roundToThousandth(resultValues.totalLoadMg) }} mg</h6>
        <h6>Concentration: {{ resultValues.concentration }} {{ resultValues.concentrationUnit }}</h6>
        <h6>Route: {{ resultValues.dosageForm === 'liquid' ? 'Liquid' : 'Tablet' }}</h6>
    </template>
</CalculatorTemplate>
</template>
<style>

.kbr-selection{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.kbr-selection label{
    white-space: nowrap;
}
</style>