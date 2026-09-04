<script setup>
import { computed, ref, watch } from 'vue';
import CalculatorTabsTemplate from '../../components/CalculatorTabsTemplate.vue';
import { UnitConversionTabs } from './UnitConversionTabs.js';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import { BloodTestCategories } from './blood/BloodTestCategories.js';
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
import { TimeConversionUnits } from './time/TimeConversionUnits.js';
import LengthConversionUnits from './length/LengthConversionUnits.js';
import { useUnitConversionGeneral } from './UnitConversionGeneral.js';

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
const volume = useUnitConversionGeneral(VolumeConversionUnits);

// Weight Tab -----------------------------------------
const weight = useUnitConversionGeneral(WeightConversionUnits);

// time tab ----------------------------------------
const time = useUnitConversionGeneral(TimeConversionUnits);

// Length tab --------------------------------------
const length = useUnitConversionGeneral(LengthConversionUnits);

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
                :results="temperatureResults"
            />
        </template>

        <!-- Volume -->
        <template #[UnitConversionTabs.TAB3]>
            <UnitConversionTabContent 
                v-model:amount="volume.amount.value"
                v-model:unit-from="volume.unitFrom.value"
                v-model:unit-to="volume.unitTo.value"
                :units="VolumeConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB3)"
                @calculate="volume.calculate"
                @reset="volume.reset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB3}`]>
            <UnitConversionTabResult 
                :results="volume.results.value"
            />
        </template>

        <!-- Wegiht -->
        <template #[UnitConversionTabs.TAB4]>
            <UnitConversionTabContent 
                v-model:amount="weight.amount.value"
                v-model:unit-from="weight.unitFrom.value"
                v-model:unit-to="weight.unitTo.value"
                :units="WeightConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB4)"
                @calculate="weight.calculate"
                @reset="weight.reset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB4}`]>
            <UnitConversionTabResult 
                :results="weight.results.value"
            />
        </template>

        <!-- Time -->
        <template #[UnitConversionTabs.TAB5]>
            <UnitConversionTabContent 
                v-model:amount="time.amount.value"
                v-model:unit-from="time.unitFrom.value"
                v-model:unit-to="time.unitTo.value"
                :units="TimeConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB5)"
                @calculate="time.calculate"
                @reset="time.reset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB5}`]>
            <UnitConversionTabResult 
                :results="time.results.value"
            />
        </template>

        <!-- Length -->
        <template #[UnitConversionTabs.TAB6]>
            <UnitConversionTabContent 
                v-model:amount="length.amount.value"
                v-model:unit-from="length.unitFrom.value"
                v-model:unit-to="length.unitTo.value"
                :units="LengthConversionUnits"
                :show-tab-errors="tabTemplate?.showErrors(UnitConversionTabs.TAB6)"
                @calculate="length.calculate"
                @reset="length.reset"
            />
        </template>

        <template #[`result-${UnitConversionTabs.TAB6}`]>
            <UnitConversionTabResult 
                :results="length.results.value"
            />
        </template>
    </CalculatorTabsTemplate>
</template>
<style scoped>
</style>