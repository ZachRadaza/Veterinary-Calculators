<script setup>
import { computed, ref } from 'vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalcRowTwoOptions from '../../components/calculator-rows/CalcRowTwoOptions.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { NSAIDAmountType } from './NSAIDAmountType.js';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';
import CalcRowPatientSpecies from '../../components/calculator-rows/CalcRowPatientSpecies.vue';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import { NSAIDDrugs } from './NSAIDDrugs.js';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import { usePatient } from '../../composables/Patient.js';
import NSAIDHelper from './NSAIDHelper.js';
import { lbsToKg } from '../../utils/CalculatorUtils.js';
import { PatientSpecies } from '../../utils/PatientSpecies.js';
import DialogInfo from '../../components/dialogs/DialogInfo.vue';

const calculator = useCalculator();
const patient = usePatient();

const amount = ref({
    amountMg: 0,
    amountNumPill: 0,
    amountType: NSAIDAmountType.DIRECT
});
const drug = ref(0);
const dialogNoData = ref(null);

const result = ref(null);
//refs not computed to prevent result from changing when input is changed
const resultHeader = ref('');
const currentDrugInfo = ref(null);

const dialogDesc = computed(() => `Sorry, no data for the effects of ${drug.value} on ${patient.inputtedPatient.value?.species} is available.`);

function resultThresholdAmount(amountMgKg){
    if(!amountMgKg)
        return 'Not Reported';
    
    if(amountMgKg === 0.0001)
        return 'Any Dosage';

    return `${amountMgKg} mg/kg`
}

function getResultHeader(){
    if(!result.value)
        return '';

    const start = `At this dosage of ${result.value?.totalMg} mg/kg, your ${patient.inputtedPatient.value?.species} is`;

    if(result.value.effects?.length <= 0)
        return `${start} most likely not at risk.`;
    else
        return `${start} at risk of developing`;
}

function calculate(){
    calculator.startCalculator();

    if(!patient.validateInputtedPatient())
        return;

    if(drug.value === 0)
        return;

    if(amount.value.amountMg === 0)
        return;

    if(amount.value.amountType === NSAIDAmountType.PERPILL && amount.value.amountNumPill === 0)
        return;

    const totalAmount = NSAIDHelper.calculateTotalMg(
        Number(amount.value.amountMg), 
        Number(amount.value.amountNumPill), 
        amount.value.amountType
    );
    const patientWeightKg = lbsToKg(patient.inputtedPatient.value.weight);

    result.value = NSAIDHelper.calculateNSAIDToxicity(
        drug.value,
        patient.inputtedPatient.value.species,
        patientWeightKg,
        totalAmount
    );

    currentDrugInfo.value = NSAIDDrugs[drug.value]?.[patient.inputtedPatient.value?.species];
    resultHeader.value = getResultHeader();
    calculator.endCalculator();

    if(!result.value){
        calculator.showResults.value = false;
        dialogNoData.value.openDialog();
    }
}

function reset(){
    calculator.resetCalculator();
    patient.resetInputtedPatient();

    drug.value = 0;
    amount.value = {
        amountMg: 0,
        amountNumPill: 0,
        amountType: NSAIDAmountType.DIRECT
    };
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowPatientSpecies :only-dog-cat="true"/>

        <CalcRowPatientWeight/>

        <CalcRowSelect 
            label="Nonsteroidal Anti-inflammatory Drug: "
            v-model="drug"
            :options="Object.keys(NSAIDDrugs)"
            default-option-label="-- Select NSAID --"
            :show-error="calculator.showErrors.value && drug === 0"
        />

        <CalcRowTwoOptions 
            label="Quantity Type: "
            :option1="{ label: NSAIDAmountType.DIRECT, value: NSAIDAmountType.DIRECT }"
            :option2="{ label: NSAIDAmountType.PERPILL, value: NSAIDAmountType.PERPILL }"
            v-model="amount.amountType"
        />

        <CalcRowInputLabel 
            label="Quantity: "
            input-label="mg"
            v-model="amount.amountMg"
            class="short"
            :error="calculator.showErrors.value && amount.amountMg === 0"
        />

        <!-- number of pills -->
        <CalcRowInputLabel 
            label="Number of Pills: "
            input-label=""
            v-model="amount.amountNumPill"
            v-show="amount.amountType === NSAIDAmountType.PERPILL"
            :error="calculator.showErrors.value && amount.amountNumPill === 0"
            class="short"
        />

        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

        <template #results>
            <div class="flex-col">
                <h6>{{ resultHeader }}</h6>
                <ol v-if="result?.effects">
                    <li v-for="effect in result.effects" :key="effect">{{ effect }}</li>
                </ol>
            </div>
            <div class="flex-col">
                <h6>Threshold Dosages:</h6>
                <ul>
                    <li>Dosage for Gastrointestinal effects = {{ resultThresholdAmount(currentDrugInfo?.gi) }}</li>
                    <li>Dosage for Renal effects = {{ resultThresholdAmount(currentDrugInfo?.renal) }}</li>
                    <li>Dosage for CNS effects = {{ resultThresholdAmount(currentDrugInfo?.cns) }}</li>
                </ul>
            </div>
        </template>
    </CalculatorTemplate>

    <DialogInfo 
        ref="dialogNoData"
        title="No Data"
        :descriptions="[dialogDesc]"
    />
</template>
<style scoped>

.flex-col{
    min-width: 450px;
}

</style>