<script setup>
import { computed, ref, watch } from 'vue';
import { usePatient } from '../composables/Patient';
import { getAge } from '../utils/DateUtils';

const patient = usePatient();

const selectedPatientId = ref(patient.currentPatientId.value || -1);
const patientInput = ref('');

const currentPatient = computed(() => patient.currentPatient?.value ?? null);
const currentPatientAge = computed(() => getAge(currentPatient.value?.dateOfBirth));

watch(() => selectedPatientId.value, (newlySelectedId) => {
    patient.setCurrentPatientId(newlySelectedId);
    patientInput.value = currentPatient.value?.name || '';
}, { immediate: true });

watch(() => patient.currentPatientId.value, (patientId) => {
    if(patientId === selectedPatientId.value)
        return;

    selectedPatientId.value = patientId;
});

function handleSearch(){
    if(!patientInput.value)
        return;

    const input = patientInput.value.toLowerCase();

    const scoredNames = patient.patientsList.value.map((pat) => {
        const name = pat.name.toLowerCase();
        let score = 0;

        if(name === input)
            score = 100;
        else if(name.startsWith(input))
            score = 75;
        else if (name.includes(input))
            score = 50;
        else
            score = getFuzzyScore(name, input);

        return { id: pat.id, score };
    });

    scoredNames.sort((a, b) => b.score - a.score);

    patient.setCurrentPatientId(scoredNames[0].id ?? -1);
}

function getFuzzyScore(name, query){
    let queryIndex = 0;
    let score = 0;

    for (let nameIndex = 0; nameIndex < name.length; nameIndex++) {
        if (name[nameIndex] === query[queryIndex]) {
            score++;
            queryIndex++;
        }

        if (queryIndex === query.length)
            return score;
    }

    return 0;
}

</script>
<template>
    <div class="patient-chooser">
        <div class="patient-input">

            <select v-model="selectedPatientId">
                <option value="-1">Select Patient</option>
                <option v-for="pat in patient.patientsList.value" :value="pat?.id">{{ pat?.name }}</option>
            </select>

            <input 
                v-model="patientInput" 
                placeholder="Patient Name"
                @keyup.enter="handleSearch"
            />

            <button 
                @click="handleSearch"
                class="secondary"
            >
                Search
            </button>

        </div>
        <div v-if="currentPatient" class="patient-info">
            <h5>
                {{ currentPatient?.name }} | 
                {{ currentPatient?.species }} | 
                {{ currentPatient?.breed }} | 
                {{ currentPatient?.weight }} lbs | 
                {{ currentPatient?.sex }} | 
                {{ currentPatientAge }}
            </h5>
        </div>
    </div>
</template>
<style scoped>

.patient-chooser{
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    background: var(--color-secondary);
}

.patient-input{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.patient-input > *{
    border-radius: 0;
    height: 1.5rem;

}

.patient-input > :last-child{
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

.patient-input > :first-child{
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
}

.patient-info h5{
    color: var(--color-bg);
    text-align: center;
}

</style>