<script setup>
import { computed, ref, watch } from 'vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { Days100 } from './Days100.js';
import { NumFeedings } from './NumFeedings.js';
import { RecoveryDietOptions } from './RecoveryDietOptions.js';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowTwoOptions from '../../components/calculator-rows/CalcRowTwoOptions.vue';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';
import { usePatient } from '../../composables/Patient.js';
import { lbsToKg, roundToThousandth, verifyNumberInput } from '../../utils/CalculatorUtils.js';
import InputLabel from '../../components/InputLabel.vue';
import CalcRow from '../../components/calculator-rows/CalcRow.vue';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import FeedTubeHelper from './FeedTubeHelper.js';

const calculator = useCalculator();
const patient = usePatient();

const daysUntil100 = ref(Days100[0]);
const numFeedings = ref(NumFeedings[0]);
const recoveryDiet = ref(0);
const isDiluting = ref(false);

const densityDirectly = ref(true);
const densityValues = ref({
    direct: '0',
    perCanKcal: '0',
    perCanMl: '0'
});

const dilutingVolumes = ref({
    volumeProduct:'0',
    volumeWater: '0'
});

const results = ref(null);

const showErrorVolumeWater = computed(() =>
    calculator.showErrors.value && dilutingVolumes.value.volumeWater <= 0
);
const showErrorVolumeProduct = computed(() => 
    calculator.showErrors.value && dilutingVolumes.value.volumeProduct <= 0
);
const showErrorDensityDirectly = computed(() => 
    calculator.showErrors.value && 
    densityValues.value.direct <= 0 &&
    densityDirectly.value
);
const showErrorDensityPerCan = computed(() => 
    calculator.showErrors.value && 
    !densityDirectly.value
);

watch(() => isDiluting.value, (diluting) => {
    resetDilutingVolumes();
}, { immediate: true });

watch(() => recoveryDiet.value, (diet) => {
    if(diet === RecoveryDietOptions.OTHER)
        resetDensityValues();
})

function resetDilutingVolumes(){
    dilutingVolumes.value = {
        volumeProduct:'0',
        volumeWater: '0'
    };
}

function resetDensityValues(){
    densityValues.value = {
        direct: '0',
        perCanKcal: '0',
        perCanMl: '0'
    }
}

function handleDensityDirect(){
    const direct = densityValues.value.direct;
    densityValues.value.direct = verifyNumberInput(direct, 0, 100000);
}

function handleDensityPerCanKcal(){
    const kcal = densityValues.value.perCanKcal;
    densityValues.value.perCanKcal = verifyNumberInput(kcal, 0, 100000);
}

function handleDensityPerCanMl(){
    const ml = densityValues.value.perCanMl;
    densityValues.value.perCanMl = verifyNumberInput(ml, 0, 100000);
}

function handleDilutingVolumesWater(){
    const water = dilutingVolumes.value.volumeWater;
    dilutingVolumes.value.volumeWater = verifyNumberInput(water, 0, 100000);
}

function handleDilutingVolumesProduct(){
    const product = dilutingVolumes.value.volumeProduct;
    dilutingVolumes.value.volumeProduct = verifyNumberInput(product, 0, 100000);
}

function calculate(){
    calculator.startCalculator();

    if(!patient.validateInputtedPatient())
        return;

    if(recoveryDiet.value <= 0)
        return;

    if(recoveryDiet.value === RecoveryDietOptions.OTHER){
        if(densityDirectly.value && densityValues.value.direct <= 0)
            return;

        if(!densityDirectly.value && (densityValues.value.perCanKcal <= 0 || densityValues.value.perCanMl <= 0))
            return;
    }

    if(isDiluting.value && (dilutingVolumes.value.volumeProduct <= 0 || dilutingVolumes.value.volumeWater <= 0))
        return;

    const weightKg = lbsToKg(patient?.inputtedPatient?.value?.weight);

    results.value = FeedTubeHelper.calculateFeedingTube(
        weightKg,
        recoveryDiet.value,
        daysUntil100.value,
        numFeedings.value,
        densityValues.value,
        isDiluting.value,
        dilutingVolumes.value
    );

    calculator.endCalculator();
}

function reset(){
    calculator.resetCalculator();
    patient.resetInputtedPatient();

    daysUntil100.value = Days100[0];
    numFeedings.value = NumFeedings[0];
    recoveryDiet.value = 0;
    isDiluting.value = false;
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowPatientWeight />
        
        <CalcRowSelect 
            label="Days until 100% RER: "
            :options="Days100"
            v-model="daysUntil100"
            class="short"
        />

        <CalcRowSelect 
            label="Number of feedings per day: "
            :options="NumFeedings"
            v-model="numFeedings"
            class="short"
        />

        <CalcRowSelect 
            label="Select Recovery Diet: "
            :options="Object.values(RecoveryDietOptions)"
            v-model="recoveryDiet"
            default-option-label="-- Select a Diet --"
            :show-error="calculator.showErrors.value && recoveryDiet <= 0"
            class="long"
        />

        <!-- other values recovery diet-->
        <CalcRow
            label="Caloric Density: "
            v-show="recoveryDiet === RecoveryDietOptions.OTHER"
        >
            <div class="caloric-density flex-col">
                <div class="radio-row">
                    <input type="radio" :value="true" v-model="densityDirectly"/>
                    <InputLabel 
                        label="kcal/ml"
                        v-model="densityValues.direct"
                        @input="handleDensityDirect"
                        :disabled="!densityDirectly"
                        class="short"
                        :error="showErrorDensityDirectly"
                    />
                </div>
                <h6> - OR - </h6>
                <div class="radio-row top">
                    <input type="radio" :value="false" v-model="densityDirectly"/>
                    <div class="flex-col">
                        <InputLabel 
                            label="kcal"
                            v-model="densityValues.perCanKcal"
                            @input="handleDensityPerCanKcal"
                            :disabled="densityDirectly"
                            class="short"
                            :error="showErrorDensityPerCan && densityValues.perCanKcal <= 0"
                        />
                        <InputLabel 
                            label="ml"
                            v-model="densityValues.perCanMl"
                            @input="handleDensityPerCanMl"
                            :disabled="densityDirectly"
                            class="short"
                            :error="showErrorDensityPerCan && densityValues.perCanMl <= 0"
                        />
                    </div>
                </div>
            </div>
        </CalcRow>
        <!-- end -->

        <CalcRowTwoOptions 
            v-model="isDiluting"
            label="Are you diluting this product with water?"
            :option1="{ label: 'Yes', value: true }"
            :option2="{ label: 'No', value: false }"
        />

        <!-- YES diluting in water-->
        <CalcRowInputLabel 
            label="Volume of Product: "
            input-label="ml"
            :error="showErrorVolumeProduct"
            v-show="isDiluting"
            class="short"
            @input="handleDilutingVolumesProduct"
            v-model="dilutingVolumes.volumeProduct"
        />

        <CalcRowInputLabel 
            label="Volume of Water: "
            input-label="ml"
            :error="showErrorVolumeWater"
            v-show="isDiluting"
            class="short"
            @input="handleDilutingVolumesWater"
            v-model="dilutingVolumes.volumeWater"
        />
        <!-- end -->

        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

        <template #results>
            <h5>RER: {{ roundToThousandth(results?.rer) }} kcal/day</h5>
            <h6>Energy Density: {{ roundToThousandth(results?.energyDensity) }} kcal/mL</h6>
            <h6>Dilution: {{ roundToThousandth(results?.dilutionPercent) }}% of original concentration</h6>
            <h6>Daily volume at 100% RER: {{ roundToThousandth(results?.dailyVolumeAt100) }} mL/day</h6>
            <h6>Number of feedings: {{ roundToThousandth(results?.numFeedings) }}/day</h6>
            <h6>Volume per feeding at 100% RER: {{ roundToThousandth(results?.volumePerFeedingAt100) }} mL/feed</h6>
            <h5>Feeding Schedule</h5>
            <div class="feeding-schedule">
                <div class="day" v-for="day in results?.schedule" :key="day.day">
                    <h6>Day {{ day?.day }}: {{ roundToThousandth(day?.percentRER) }}% RER</h6>
                    <p>{{ roundToThousandth(day?.kcalPerDay) }} kcal/day</p>
                    <p>{{ roundToThousandth(day?.volumePerDay) }} mL/day</p>
                    <p>{{ roundToThousandth(day?.volumePerFeeding) }} mL/feed</p>
                </div>
            </div>
        </template>
    </CalculatorTemplate>
</template>
<style scoped>

.feeding-schedule{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 200px));
    gap: 1rem;
    width: 100%;
    justify-content: center;
}

.day{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
    align-items: center;
    justify-content: center;
}

</style>