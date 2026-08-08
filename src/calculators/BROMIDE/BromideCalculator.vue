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
const showTotalLoadRectallyText = computed(() =>
    kbrData.value.takingRectally && 
    selectedCompound.value === BromideCompoundChoices.KBR && 
    kbrData.value.concentration === KbrConcentrationOptions.ML
);
const showDaysLoadRectallyText = computed(() => 
    kbrData.value.takingRectally && 
    selectedCompound.value === BromideCompoundChoices.KBR && 
    kbrData.value.concentration === KbrConcentrationOptions.ML
);
const showDosesPerDayRectallyText = computed(() =>
    kbrData.value.takingRectally &&
    selectedCompound.value === BromideCompoundChoices.KBR &&
    kbrData.value.concentration === KbrConcentrationOptions.ML
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
    calculator.showResults.value = false;
    calculator.showErrors.value = true;

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
        <div class="kbr-selection">
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

    <CalcRow label="Taking Rectally: " v-if="showTakingRectally">
        <div class="radio-col">
            <label>
                <input type="radio" :value="true" v-model="kbrData.takingRectally"/> Yes
            </label>
            <label>
                <input type="radio" :value="false" v-model="kbrData.takingRectally"/> No
            </label>
        </div>
    </CalcRow>
    <!-- end-->

    <!-- NaBr stuff-->
     <CalcRow label="NaBr Concentration: " v-if="selectedCompound === BromideCompoundChoices.NABR">
        <InputLabel 
            label="mg/ml" 
            v-model="naBrData.concentrationML" 
            :error="calculator.showErrors && naBrData.concentrationML <= 0"
            class="short"
        />
     </CalcRow>
    <!--end-->

    <CalcRow label="Also Taking Phenobarbital: " v-if="showTakingPhenoberbital">
        <div class="radio-col">
            <label>
                <input type="radio" :value="true" v-model="sharedData.takingPhenobarbital"/> Yes
            </label>
            <label>
                <input type="radio" :value="false" v-model="sharedData.takingPhenobarbital"/> No
            </label>
        </div>
    </CalcRow>

    <CalcRow label="Total Load: ">
        <h5 v-if="showTotalLoadRectallyText">{{ sharedData.totalLoad }} mg/kg</h5>
        <select 
            v-else v-model="sharedData.totalLoad" 
            :class="`${calculator.showErrors.value && sharedData.totalLoad === 0 ? 'error' : ''}`"
        >
            <option :value="0">Select a Dose</option>
            <option
                v-for="load in selectedTotalLoads" 
                :value="load" 
                :key="load"
            >{{ load }} mg/kg</option>
        </select>
    </CalcRow>
    <CalcRow label="Days To Load: ">
        <h5 v-if="showDaysLoadRectallyText">{{ sharedData.daysLoad }} Day</h5>
        <select 
            v-else v-model="sharedData.daysLoad"
            :class="`${calculator.showErrors.value && sharedData.daysLoad === 0 ? 'error' : ''}`"
        >
            <option :value="0">Select Number of Days</option>
            <option v-for="days in DaysToLoad" :key="days" :value="days">{{ days }} Days</option>
        </select>
    </CalcRow>
    <CalcRow label="Number of Doses per day: ">
        <h5 v-if="showDosesPerDayRectallyText">{{ sharedData.numDoses }} Doses Per Day</h5>
        <select 
            v-else v-model="sharedData.numDoses"
            :class="`${calculator.showErrors.value && sharedData.numDoses <= 0 ? 'error' : ''}`"
        >
            <option :value="0">Select Doses Per Day</option>
            <option v-for="doses in NumberOfDoses" :key="doses" :value="doses">{{ doses }} Doses</option>
        </select>
    </CalcRow>

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