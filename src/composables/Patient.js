import { computed, ref, watch } from "vue";
import PatientService from "../services/PatientService";
import { PatientSpecies } from "../utils/PatientSpecies";
import { useUser } from "./User";
import router from "../router";

const _currentPatientId = ref(0);
const _patients = ref(new Map());
const inputtedPatient = ref(null);

const currentPatientId = computed(() => _currentPatientId.value);
const patients = computed(() => [..._patients.value]);
const patientsList = computed(() => 
    [..._patients.value?.values()]
);
const currentPatient = computed(() => _patients.value.get(_currentPatientId.value) ?? null);

const validInputtedPatientWeight = computed(() => inputtedPatient?.value?.weight > 0);
const validInputtedPatientSpecies = computed(() => Object.values(PatientSpecies).includes(inputtedPatient?.value?.species));
const currentAndInputtedWeightEqual = computed(() => currentPatient.value?.weight === inputtedPatient.value?.weight);

const getPatient = (id) => {
    return _patients.value.get(id) ?? null;
}

async function loadListOfPatients(userId){
    try{
        const patientsList = await PatientService.getPatients(userId);
        const patientsMap = new Map();

        patientsList.map((patients) => {
            patientsMap.set(patients.id, patients);
        });

        _patients.value = patientsMap;
    } catch(error){
        console.error('Error in loading list of patients: ', error);
    }
}

function changeCurrentPatientId(patientId){
    if(patientId === _currentPatientId.value)
        return;

    router.push({ query: { ...router.currentRoute.value.query, patientId }});
}

function setCurrentPatientId(patientId){
    if(patientId === _currentPatientId.value)
        return;

    _currentPatientId.value = patientId;

    //inputtedPatient.value = JSON.parse(JSON.stringify(currentPatient.value));
    
    if(!inputtedPatient.value)
        resetInputtedPatient();
}

function resetInputtedPatient(){
    if(currentPatient.value)
        inputtedPatient.value = JSON.parse(JSON.stringify(currentPatient.value));
    else
        inputtedPatient.value = {
            id: -1,
            name: "",
            species: PatientSpecies.DOG,
            breed: "",
            weight: 0,
            sex: "Male",
            dob: "2004-07-07",
            createdAt: "",
        };
    router.push({ query: { patientId: currentPatientId.value }});
}

function validateInputtedPatient(){
    return validInputtedPatientSpecies.value && validInputtedPatientWeight.value;
}

async function addPatientHelper(userId, patient){
    try{
        const addedPatient =  await PatientService.addPatient(
            userId,
            patient.name,
            patient.species,
            patient.breed,
            patient.weight,
            patient.sex,
            patient.dateOfBirth,
            patient.patientNum,
            patient.clientName,
            patient.color,
            patient.comments
        );
        
        if(!addedPatient)
            return null;

        _patients.value.set(addedPatient.id, addedPatient);
        return addedPatient;
    } catch(error){
        console.error('Error in adding patient', error);
    }
}

async function editPatientHelper(userId, patient){
    try{
        const editedPatient =  await PatientService.updatePatient(userId, patient.id, patient);
        
        _patients.value.set(editedPatient.id, editedPatient);
        return editedPatient;
    } catch(error){
        console.error('Error in editing patient', error);
    }
}

async function deletePatientHelper(userId, patientId){
    try{
        await PatientService.deletePatient(userId, patientId);

        _patients.value.delete(patientId);
        return true;
    } catch(error){
        console.error('Error in deleting patient', error);
        return false;
    }
}

export function usePatient(){
    
    const user = useUser();

    async function init(){
        watch(user.userId, async (userId) => {
            await loadListOfPatients(userId);
        });
    }

    async function addPatient(patient){
        return addPatientHelper(user.userId.value, patient);
    }

    async function editPatient(patient){
        return editPatientHelper(user.userId.value, patient);
    }

    async function deletePatient(patientId){
        return deletePatientHelper(user.userId.value, patientId);
    }

    return {
        currentPatient, currentPatientId, patients, inputtedPatient, patientsList, 
        validInputtedPatientSpecies, validInputtedPatientWeight, currentAndInputtedWeightEqual,
        loadListOfPatients, init, setCurrentPatientId, resetInputtedPatient, validateInputtedPatient, changeCurrentPatientId,
        addPatient, editPatient, deletePatient, getPatient
    }
}