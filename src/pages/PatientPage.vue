<script setup>
import Header from '../components/Header.vue';
import PatientChooser from '../components/PatientChooser.vue';
import { usePatient } from '../composables/Patient.js';

const patient = usePatient();

</script>
<template>
    <Header />
    <body>
        <div class="content-wrapper">
            <div class="content-container">
                <div class="patients-area content-area">
                    <h4 class="header-title">Patients</h4>
                    <div class="patients-cont">
                        <div class="patients-list">
                            <button v-for="pat in patient.patientsList.value" 
                                :key="pat.id"
                                :class="`patient-btn secondary ${pat.id === patient.currentPatientId.value ? 'selected' : ''}`"
                                @click="patient.setCurrentPatientId(pat.id)"
                            >
                                {{ pat?.name }}
                            </button>
                        </div>
                    </div>
                    <div class="buttons-cont">
                        <button>Add Patient</button>
                        <button :disabled="patient.currentPatientId.value === -1">Edit/View Patient</button>
                        <button :disabled="patient.currentPatientId.value === -1">Remove Patient</button>
                        <button @click="patient.setCurrentPatientId(-1)">Clear Section</button>
                    </div>
                </div>
                <div class="calculations-area content-area">
                    <h4 class="header-title">Calculations</h4>
                    <table class="calculations-table">

                    </table>
                    <div class="buttons-cont">
                        <button>Add Patient</button>
                        <button>Edit/View Patient</button>
                        <button>Remove Patient</button>
                        <button>Clear Section</button> 
                    </div>
                </div>
            </div>
            <PatientChooser />
        </div>
    </body>
</template>
<style scoped>

.content-wrapper{
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 0.2rem solid var(--color-primary);
    margin: 1rem;
    box-sizing: border-box;
    overflow: hidden;
}

.content-container{
    display: grid;
    grid-template-columns: 4fr 6fr;
}

.header-title{
    padding: 1rem;
    background: var(--color-secondary);
    color: var(--color-bg);
}

.content-area{
    display: flex;
    flex-direction: column;
}

.content-area :is(.patients-cont, .calculations-table){
    min-height: 400px;
    max-height: 600px;
    overflow: auto;
    height: 100%;
}

.buttons-cont{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-top: 0.1rem solid var(--color-primary);
}

.calculations-area{
    border-left: 0.2rem solid var(--color-primary);
}

.patients-list{
    display: flex;
    flex-direction: column;
}

.patient-btn{
    border-radius: 0;
    padding: 1rem 1.4rem;
}

.patient-btn.selected, .patient-btn:nth-child(odd).selected{
    background: var(--color-secondary);
    color: var(--color-bg);
}

.patient-btn:nth-child(odd){
    background: var(--color-bg-secondary);
}

.patient-btn:nth-child(odd):is(:hover, :focus){
    background: var(--color-primary);
}

</style>