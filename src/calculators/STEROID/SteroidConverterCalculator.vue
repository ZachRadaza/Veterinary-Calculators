<script setup>
import { ref } from 'vue';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import CalculatorTabsTemplate from '../../components/CalculatorTabsTemplate.vue';
import { SteroidConverterTabs } from './SteroidConverterTabs.js';
import { SteroidDrugs } from './SteroidDrugs.js';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import { usePatient } from '../../composables/Patient.js';
import DialogInfo from '../../components/dialogs/DialogInfo.vue';
import SteroidConverterHelper from './SteroidConverterHelper.js';
import CalcRow from '../../components/calculator-rows/CalcRow.vue';
import { roundToThousandth } from '../../utils/CalculatorUtils.js';

const calculator = useCalculator();

const tabTemplate = ref(null);
const dialogSameSteroid = ref(null);

const glucData = ref({
    steroidFrom: Object.keys(SteroidDrugs)[0],
    steroidTo: Object.keys(SteroidDrugs)[1],
    dose: 0
});
const mineData = ref({
    steroidFrom: Object.keys(SteroidDrugs)[0],
    steroidTo: Object.keys(SteroidDrugs)[1],
    dose: 0
})

const glucResult = ref(null);
const mineResult = ref(null);

function calculateGluc(){
    calculator.startCalculator();

    if(glucData.value.dose <= 0)
        return;

    if(glucData.value.steroidFrom === glucData.value.steroidTo){
        dialogSameSteroid.value?.openDialog();
        calculator.calculatorCalculating.value = false;
        return;
    }

    glucResult.value = SteroidConverterHelper.calculateSteroidConversionGluc(
        glucData.value.steroidFrom,
        glucData.value.steroidTo,
        Number(glucData.value.dose)
    );

    calculator.endCalculator();
}

function calculateMine(){
    calculator.startCalculator();

    if(mineData.value.dose <= 0)
        return;

    if(mineData.value.steroidFrom === mineData.value.steroidTo){
        dialogSameSteroid.value?.openDialog();
        calculator.calculatorCalculating.value = false;
        return;
    }

    mineResult.value = SteroidConverterHelper.calculateSteroidConversionMine(
        mineData.value.steroidFrom,
        mineData.value.steroidTo,
        Number(mineData.value.dose)
    );

    calculator.endCalculator();
}

function resetGluc(){
    calculator.resetCalculator();

    glucData.value = {
        steroidFrom: Object.keys(SteroidDrugs)[0],
        steroidTo: Object.keys(SteroidDrugs)[0],
        dose: 0
    };
}

function resetMine(){
    calculator.resetCalculator();

    mineData.value = {
        steroidFrom: Object.keys(SteroidDrugs)[0],
        steroidTo: Object.keys(SteroidDrugs)[0],
        dose: 0
    };
}

</script>
<template>
<CalculatorTabsTemplate 
    ref="tabTemplate"
    :tab-names="Object.values(SteroidConverterTabs)"
>

    <!-- Glucocococ -->
    <template #[SteroidConverterTabs.TAB1]>
        <h4 class="tab-title">{{ SteroidConverterTabs.TAB1 }} Equivalence</h4>

        <CalcRowSelect 
            label="Select a Steroid: "    
            v-model="glucData.steroidFrom"
            :options="Object.keys(SteroidDrugs)"
        />

        <CalcRowInputLabel 
            label="Dose: "
            v-model="glucData.dose"
            input-label="mg"
            :error="calculator.showErrors.value && glucData.dose <= 0 && tabTemplate?.showErrors(SteroidConverterTabs.TAB1)"
            :has-default-num-bounds-check="true"
            class="short"
        />

        <CalcRowSelect 
            label="Convert to: "    
            v-model="glucData.steroidTo"
            :options="Object.keys(SteroidDrugs)"
        />

        <CalcRowCalculateBtns :calculate="calculateGluc" :reset="resetGluc"/>
    </template>

    <template #[`result-${SteroidConverterTabs.TAB1}`]>
        <h5 class="tab-title">{{ SteroidConverterTabs.TAB1 }} Equivalence</h5>
        <div class="flex-col">
            <CalcRow :label="`Original Steroid (${glucResult?.originalSteroid?.name}): `">
                <div class="flex-col">
                    <h6>Relative Potency: {{ glucResult?.originalSteroid?.relativePotency }}</h6>
                    <h6>Duration: {{ glucResult?.originalSteroid?.duration }}</h6>
                </div>
            </CalcRow>

            <CalcRow :label="`Original Steroid (${glucResult?.newSteroid?.name}): `">
                <div class="flex-col">
                    <h6>Equivalent dose needed: {{ roundToThousandth(glucResult?.newSteroid?.equivalentDoseMg) }} mg</h6>
                    <h6>Relative potency: {{ glucResult?.newSteroid?.relativePotency }}</h6>
                    <h6>Duration: {{ glucResult?.newSteroid?.duration }}</h6>
                </div>
            </CalcRow>
        </div>
    </template>

    <!-- the other one too long to spell-->
    <template #[SteroidConverterTabs.TAB2]>
        <h4 class="tab-title">{{ SteroidConverterTabs.TAB2 }} Equivalence</h4>

        <CalcRowSelect 
            label="Select a Steroid: "    
            v-model="mineData.steroidFrom"
            :options="Object.keys(SteroidDrugs)"
        />

        <CalcRowInputLabel 
            label="Dose: "
            v-model="mineData.dose"
            input-label="mg"
            :error="calculator.showErrors.value && mineData.dose <= 0 && tabTemplate?.showErrors(SteroidConverterTabs.TAB2)"
            :has-default-num-bounds-check="true"
            class="short"
        />

        <CalcRowSelect 
            label="Convert to: "    
            v-model="mineData.steroidTo"
            :options="Object.keys(SteroidDrugs)"
        />

        <CalcRowCalculateBtns :calculate="calculateMine" :reset="resetMine"/>
    </template>

    <template #[`result-${SteroidConverterTabs.TAB2}`]>
        <h5 class="tab-title">{{ SteroidConverterTabs.TAB2 }} Equivalence</h5>

        <div class="flex-col">
            <CalcRow :label="`Original Steroid (${mineResult?.originalSteroid?.name}): `">
                <div class="flex-col">
                    <h6>Relative Potency: {{ mineResult?.originalSteroid?.relativePotency }}</h6>
                </div>
            </CalcRow>

            <CalcRow :label="`Original Steroid (${mineResult?.newSteroid?.name}): `">
                <div class="flex-col">
                    <h6>Equivalent dose needed: {{ roundToThousandth(mineResult?.newSteroid?.equivalentDoseMg) }} mg</h6>
                    <h6>Relative potency: {{ mineResult?.newSteroid?.relativePotency }}</h6>
                </div>
            </CalcRow>
        </div>
    </template>
</CalculatorTabsTemplate>

<DialogInfo 
    ref="dialogSameSteroid"
    title="Same Steroid"
    :descriptions="['Please select different steroids.']"
/>

</template>
<style scoped>
</style>