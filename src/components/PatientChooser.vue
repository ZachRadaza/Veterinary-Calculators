<script setup>
import { computed, ref, watch } from 'vue';
import { usePatient } from '../composables/Patient';

const patient = usePatient();
const selectedPatientId = ref(patient.currentPatientId.value || -1);
const patientInput = ref('');
const currentPatient = computed(() => patient.currentPatient?.value ?? null);
const patientList = computed(() => 
    [...patient.patients.value.values()].map((patList) => patList[1])
);

watch(() => selectedPatientId.value, (newlySelectedId) => {
    patient.setCurrentPatientId(newlySelectedId);
    patientInput.value = currentPatient.value?.name || '';
}, { immediate: true });

</script>
<template>
    <div class="patient-chooser">
        <div class="patient-input">
            <select v-model="selectedPatientId">
                <option value="-1">Select Patient</option>
                <option v-for="pat in patientList" :value="pat.id">{{ pat.name }}</option>
            </select>
            <input v-model="patientInput" placeholder="Patient Name"/>
            <button class="secondary">Search</button>
        </div>
        <div v-if="currentPatient" class="patient-info">
            <h5>
                {{ currentPatient?.name }} | 
                {{ currentPatient?.species }} | 
                {{ currentPatient?.breed }} | 
                {{ currentPatient?.weight }} lbs | 
                {{ currentPatient?.sex }} | 
                {{ patient.currentPatientAge}}
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