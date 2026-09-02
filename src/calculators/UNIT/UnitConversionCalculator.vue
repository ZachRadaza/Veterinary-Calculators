<script setup>
import { computed, ref, watch } from 'vue';
import CalculatorTabsTemplate from '../../components/CalculatorTabsTemplate.vue';
import { UnitConversionTabs } from './UnitConversionTabs.js';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import { BloodTestCategories } from './blood/BloodTestCategories.js';
import CalcRowInput from '../../components/calculator-rows/CalcRowInput.vue';
import CalcRowTwoOptions from '../../components/calculator-rows/CalcRowTwoOptions.vue';
import { BloodTestConversionUnits } from './blood/BloodTestConversionUnits.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';
import CalcRow from '../../components/calculator-rows/CalcRow.vue';
import BloodTestHelper from './blood/BloodTestHelper.js';
import { roundToThousandth } from '../../utils/CalculatorUtils.js';
import DialogInfo from '../../components/dialogs/DialogInfo.vue';

const tabTemplate = ref(null);
const calculator = useCalculator();

// Blood Tab --------------------------------------------------
const bloodTestValues = ref({
    category: Object.keys(BloodTestCategories)[0],
    bloodTest: 0,
    amount: 0,
    conversionUnits: BloodTestConversionUnits.SItoUS
});
const bloodResults = ref(null);
const bloodInvalidSelectDialog = ref(null);

const bloodTestOptions = computed(() => {
    if(bloodTestValues.value.category === 'All'){
        const allCategories = [
            ...BloodTestCategories["Amino Acids"],
            ...BloodTestCategories["Biochemical Analytes"],
            ...BloodTestCategories['Blood Gas Analytes'],
            ...BloodTestCategories["CBC Analytes"],
            ...BloodTestCategories['Drugs'],
            ...BloodTestCategories['Electrolytes'],
            ...BloodTestCategories['Hemostatic Analytes'],
            ...BloodTestCategories['Hormones'],
            ...BloodTestCategories['Minerals/Vitamins'],
            ...BloodTestCategories['Toxins']
        ];
    
        return allCategories.sort((a, b) => b - a);
    }

    return BloodTestCategories[bloodTestValues.value.category].sort((a, b) => b - a);
});
const bloodAmountUnitLabel = computed(() => 
    bloodTestValues.value.conversionUnits === BloodTestConversionUnits.UStoSI
        ? bloodTestValues.value.bloodTest.unitsUS
        : bloodTestValues.value.bloodTest.unitsSI
);
const bloodTestError = computed(() => 
    bloodTestValues.value.bloodTest <= 0 && 
    calculator.showErrors.value && 
    tabTemplate.value.showErrors(UnitConversionTabs.TAB1)
);
const bloodAmountError = computed(() => 
    bloodTestValues.value.amount <= 0 && 
    calculator.showErrors.value && 
    tabTemplate.value.showErrors(UnitConversionTabs.TAB1)
);

watch(() => bloodTestValues.value.category, () => { 
    for(const option of bloodTestOptions.value){
        if(option.id === bloodTestValues.value.bloodTest.id)
            return;
    }

    bloodTestValues.value.bloodTest = 0; 
});

function bloodCalculate(){
    calculator.startCalculator();

    if(bloodTestValues.value.bloodTest <= 0){
        bloodInvalidSelectDialog.value.openDialog();
        return;
    }

    if(bloodTestValues.value.amount <= 0)
        return;

    bloodResults.value = BloodTestHelper.calculateBloodConversion(
        bloodTestValues.value.amount,
        bloodTestValues.value.bloodTest,
        bloodTestValues.value.conversionUnits
    );

    console.log(bloodResults.value);

    calculator.endCalculator();
}

function bloodReset(){
    calculator.resetCalculator();

    bloodTestValues.value = {
        category: Object.keys(BloodTestCategories)[0],
        bloodTest: 0,
        amount: 0,
        conversionUnits: BloodTestConversionUnits.SItoUS
    }
}

// End of Blood tab --------------------------------------------------

</script>
<template>
    <CalculatorTabsTemplate
        :tab-names="Object.values(UnitConversionTabs)"
        ref="tabTemplate"
    >
        <!-- Blood -->
        <template #[UnitConversionTabs.TAB1]>
            <CalcRowSelect 
                v-model="bloodTestValues.category"
                label="Blood Test Category: "
                :options="Object.keys(BloodTestCategories)"
            />

            <!-- custum select to make key value work-->
            <CalcRow label="Blood Test: ">
                <select 
                    v-model="bloodTestValues.bloodTest"
                    :class="`${bloodTestError ? 'error' : ''} long`"
                >
                    <option :value="0">-- Select a Lab Test --</option>
                    <option 
                        v-for="option in bloodTestOptions" 
                        :key="option.key" 
                        :value="option"
                    >{{ bloodTestValues.conversionUnits === BloodTestConversionUnits.SItoUS
                            ? `${option.name} (${option.unitsSI} -> ${option.unitsUS})`
                            : `${option.name} (${option.unitsUS} -> ${option.unitsSI})`
                    }}</option>
                </select>

                <DialogInfo
                    ref="bloodInvalidSelectDialog"
                    title="Incomplete Input"
                    :descriptions="['Please select a Blood Test.']"
                />
            </CalcRow>

            <CalcRowInputLabel
                v-model="bloodTestValues.amount"
                label="Amount: "
                :input-label="bloodAmountUnitLabel"
                :has-default-num-bounds-check="true"
                :error="bloodAmountError"
                class="short"
            />

            <CalcRowTwoOptions 
                label="Conversion Units: "
                v-model="bloodTestValues.conversionUnits"
                :option1="{ label: BloodTestConversionUnits.SItoUS, value: BloodTestConversionUnits.SItoUS }"
                :option2="{ label: BloodTestConversionUnits.UStoSI, value: BloodTestConversionUnits.UStoSI }"
            />

            <CalcRowCalculateBtns :calculate="bloodCalculate" :reset="bloodReset"/>
        </template>

        <template #[`result-${UnitConversionTabs.TAB1}`]>
            <h5>
                {{ bloodResults?.originalAmount }} {{ bloodResults?.originalUnit }} of {{ bloodResults?.name }} 
                converts to {{ roundToThousandth(bloodResults?.convertedAmount) }} {{ bloodResults.convertedUnit }}
            </h5>
        </template>

        <!-- Temperature -->
        <template #[UnitConversionTabs.TAB2]>

        </template>

        <template #[`results-${UnitConversionTabs.TAB2}`]>
            
        </template>


        <!-- Volume -->
        <template #[UnitConversionTabs.TAB3]>

        </template>

        <template #[`results-${UnitConversionTabs.TAB3}`]>
            
        </template>

        <!-- Wegiht -->
        <template #[UnitConversionTabs.TAB4]>

        </template>

        <template #[`results-${UnitConversionTabs.TAB4}`]>
            
        </template>

        <!-- Time -->
        <template #[UnitConversionTabs.TAB5]>

        </template>

        <template #[`results-${UnitConversionTabs.TAB5}`]>
            
        </template>

        <!-- Length -->
        <template #[UnitConversionTabs.TAB6]>

        </template>

        <template #[`results-${UnitConversionTabs.TAB6}`]>
            
        </template>

    </CalculatorTabsTemplate>
</template>
<style scoped>
</style>