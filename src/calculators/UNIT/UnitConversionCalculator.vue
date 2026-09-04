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
import { TemperatureConversionUnits } from './temperature/TemperatureConversionUnits.js';
import TemperatureHelper from './temperature/TemperatureHelper.js';
import { VolumeConversionUnits } from './volume/VolumeConversionUnits.js';
import { WeightConversionUnits } from './weight/WeightConversionUnits.js';
import UnitConversionTabContent from './UnitConversionTabContent.vue';
import UnitConversionTabResult from './UnitConversionTabResult.vue';
import UnitConversionHelper from './UnitConversionHelper.js';
import { TimeConversionUnits } from './time/TimeConversionUnits.js';
import LengthConversionUnits from './length/LengthConversionUnits.js';

const tabTemplate = ref(null);
const sameUnitDialog = ref(null);
const calculator = useCalculator();

function inputCheck(input){
    if(input === '-')
        return input;

    if(input === '0-')
        return '-0';

    if(isNaN(Number(input)))
        return 0;

    return input;
}

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
// Temperature Tab ----------------------------------------------
const temperatureValues = ref({
    conversionTo: TemperatureConversionUnits.CELSIUS,
    amountLabel: '',
    amount: 0
});
const temperatureResults = ref(null);

const temperatureAmountError = computed(() => 
    isNaN(temperatureValues.value.amount) &&
    calculator.showErrors.value && 
    tabTemplate.value.showErrors(UnitConversionTabs.TAB2)
);

watch(() => temperatureValues.value.conversionTo, (unit) => {
    temperatureValues.value.amountLabel = unit === TemperatureConversionUnits.CELSIUS
        ? TemperatureConversionUnits.FAHRENHEIT
        : TemperatureConversionUnits.CELSIUS
}, { immediate: true });

function temperatureAmountCheck(){
    const amount = temperatureValues.value.amount;

    temperatureValues.value.amount = inputCheck(amount);
}

function temperatureCalculate(){
    calculator.startCalculator();
    
    temperatureResults.value = TemperatureHelper.temparatureCalculateConversion(
        temperatureValues.value.amount,
        temperatureValues.value.conversionTo
    );

    calculator.endCalculator();
}

function temperatureReset(){
    calculator.resetCalculator();

    temperatureValues.value = {
        conversionTo: TemperatureConversionUnits.CELSIUS,
        amountLabel: TemperatureConversionUnits.FAHRENHEIT,
        amount: 0
    };
}
// end of temperature -------------------------------------
// Volume tab --------------------------------------------
const volumeValues = ref({
    amount: 0,
    unitFrom: Object.keys(VolumeConversionUnits)[0],
    unitTo: Object.keys(VolumeConversionUnits)[1]
});
const volumeResults = ref(null);

function volumeCalculate(){
    volumeResults.value = UnitConversionHelper.calculateConversion(
        volumeValues.value.amount,
        volumeValues.value.unitFrom,
        volumeValues.value.unitTo,
        VolumeConversionUnits
    );
}

function volumeReset(){
    volumeValues.value = {
        amount: 0,
        unitFrom: Object.keys(VolumeConversionUnits)[0],
        unitTo: Object.keys(VolumeConversionUnits)[1]
    };
}

// end of volume --------------------------------------
// Weight Tab -----------------------------------------
const weightValues = ref({
    amount: 0,
    unitFrom: Object.keys(WeightConversionUnits)[0],
    unitTo: Object.keys(WeightConversionUnits)[1]
});
const weightResults = ref(null);

function weightCalculate(){
    weightResults.value = UnitConversionHelper.calculateConversion(
        weightValues.value.amount,
        weightValues.value.unitFrom,
        weightValues.value.unitTo,
        WeightConversionUnits
    );
}

function weightReset(){
    weightValues.value = {
        amount: 0,
        unitFrom: Object.keys(WeightConversionUnits)[0],
        unitTo: Object.keys(WeightConversionUnits)[1]
    };
}

// end of weight tab --------------------------------
// time tab ----------------------------------------
const timeValues = ref({
    amount: 0,
    unitFrom: Object.keys(TimeConversionUnits)[0],
    unitTo: Object.keys(TimeConversionUnits)[1]
});
const timeResults = ref(null);

function timeCalculate(){
    timeResults.value = UnitConversionHelper.calculateConversion(
        timeValues.value.amount,
        timeValues.value.unitFrom,
        timeValues.value.unitTo,
        TimeConversionUnits
    );
}

function timeReset(){
    timeValues.value = {
        amount: 0,
        unitFrom: Object.keys(TimeConversionUnits)[0],
        unitTo: Object.keys(TimeConversionUnits)[1]
    };
}

// end of time tab -----------------------------------
// Length tab --------------------------------------
const lengthValues = ref({
    amount: 0,
    unitFrom: Object.keys(LengthConversionUnits)[0],
    unitTo: Object.keys(LengthConversionUnits)[1]
});
const lengthResults = ref(null);

function lengthCalculate(){
    lengthResults.value = UnitConversionHelper.calculateConversion(
        lengthValues.value.amount,
        lengthValues.value.unitFrom,
        lengthValues.value.unitTo,
        LengthConversionUnits
    );
}

function lengthReset(){
    lengthValues.value = {
        amount: 0,
        unitFrom: Object.keys(LengthConversionUnits)[0],
        unitTo: Object.keys(LengthConversionUnits)[1]
    };
}

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
                        :key="option.id" 
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
            <CalcRowInputLabel 
                label="Amount: "
                v-model="temperatureValues.amount"
                :input-label="temperatureValues.amountLabel"
                :error="temperatureAmountError"
                :has-default-num-bounds-check="false"
                @input="temperatureAmountCheck"
                class="short"
            />

            <CalcRowTwoOptions 
                label="Conversion Units"
                v-model="temperatureValues.conversionTo"
                :option1="{ label: 'Celsius to Fahrenheit', value: TemperatureConversionUnits.FAHRENHEIT }"
                :option2="{ label: 'Fahrenheit to Celsius', value: TemperatureConversionUnits.CELSIUS}"
            />

            <CalcRowCalculateBtns :calculate="temperatureCalculate" :reset="temperatureReset"/>
        </template>

        <template #[`result-${UnitConversionTabs.TAB2}`]>
            <UnitConversionTabResult 
                :amount-from="temperatureResults.conversionFromAmount"
                :amount-to="temperatureResults.conversionToAmount"
                :unit-from="temperatureResults.conversionFrom"
                :unit-to="temperatureResults.conversionTo"
            />
        </template>

        <!-- Volume -->
        <template #[UnitConversionTabs.TAB3]>
            <UnitConversionTabContent 
                v-model:amount="volumeValues.amount"
                v-model:unit-from="volumeValues.unitFrom"
                v-model:unit-to="volumeValues.unitTo"
                :units="VolumeConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB3)"
                @calculate="volumeCalculate"
                @reset="volumeReset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB3}`]>
            <UnitConversionTabResult 
                :amount-from="volumeResults.fromAmount"
                :amount-to="volumeResults.toAmount"
                :unit-from="volumeResults.fromUnit"
                :unit-to="volumeResults.toUnit"
            />
        </template>

        <!-- Wegiht -->
        <template #[UnitConversionTabs.TAB4]>
            <UnitConversionTabContent 
                v-model:amount="weightValues.amount"
                v-model:unit-from="weightValues.unitFrom"
                v-model:unit-to="weightValues.unitTo"
                :units="WeightConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB4)"
                @calculate="weightCalculate"
                @reset="weightReset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB4}`]>
            <UnitConversionTabResult 
                :amount-from="weightResults.fromAmount"
                :amount-to="weightResults.toAmount"
                :unit-from="weightResults.fromUnit"
                :unit-to="weightResults.toUnit"
            />
        </template>

        <!-- Time -->
        <template #[UnitConversionTabs.TAB5]>
            <UnitConversionTabContent 
                v-model:amount="timeValues.amount"
                v-model:unit-from="timeValues.unitFrom"
                v-model:unit-to="timeValues.unitTo"
                :units="TimeConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB4)"
                @calculate="timeCalculate"
                @reset="timeReset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB5}`]>
            <UnitConversionTabResult 
                :amount-from="timeResults.fromAmount"
                :amount-to="timeResults.toAmount"
                :unit-from="timeResults.fromUnit"
                :unit-to="timeResults.toUnit"
            />
        </template>

        <!-- Length -->
        <template #[UnitConversionTabs.TAB6]>
            <UnitConversionTabContent 
                v-model:amount="lengthValues.amount"
                v-model:unit-from="lengthValues.unitFrom"
                v-model:unit-to="lengthValues.unitTo"
                :units="LengthConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB4)"
                @calculate="lengthCalculate"
                @reset="lengthReset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB6}`]>
            <UnitConversionTabResult 
                :amount-from="lengthResults.fromAmount"
                :amount-to="lengthResults.toAmount"
                :unit-from="lengthResults.fromUnit"
                :unit-to="lengthResults.toUnit"
            />
        </template>
    </CalculatorTabsTemplate>
</template>
<style scoped>
</style>