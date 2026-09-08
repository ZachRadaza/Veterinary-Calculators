import { computed, ref, watch } from "vue";
import PatientService from "../services/PatientService";
import { PatientSpecies } from "../utils/PatientSpecies";
import { useUser } from "./User";

const _currentPatientId = ref(0);
const _patients = ref(new Map());
const inputtedPatient = ref(null);

const currentPatientId = computed(() => _currentPatientId.value);
const patients = computed(() => [..._patients.value]);
const patientsList = computed(() => 
    [..._patients.value?.values()]
);
const currentPatient = computed(() => _patients.value.get(_currentPatientId.value) ?? null);
const currentPatientAge = computed(() => currentPatient.value.dateOfBirth);

const validInputtedPatientWeight = computed(() => inputtedPatient?.value?.weight > 0);
const validInputtedPatientSpecies = computed(() => Object.values(PatientSpecies).includes(inputtedPatient?.value?.species));
const currentAndInputtedWeightEqual = computed(() => currentPatient.value?.weight === inputtedPatient.value?.weight);

export function usePatient(){
    
    async function init(){
        const user = useUser();

        watch(user.userId, async (userId) => {
            await loadListOfPatients(userId);
        });
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

    function setCurrentPatientId(patientId){
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

    }

    function validateInputtedPatient(){
        return validInputtedPatientSpecies.value && validInputtedPatientWeight.value;
    }

    async function addPatient(patient){
        try{
            const user = useUser();
            const addedPatient =  await PatientService.addPatient(
                user.userId.value,
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

    async function editPatient(patient){
        try{
            const user = useUser();

            const editedPatient =  await PatientService.updatePatient(user.userId.value, patient.id, patient);
            
            _patients.value.set(editedPatient.id, editedPatient);
            return editedPatient;
        } catch(error){
            console.error('Error in editing patient', error);
        }
    }

    async function deletePatient(patientId){
        try{
            const user = useUser();

            await PatientService.deletePatient(user.userId.value, patientId);

            _patients.value.delete(patientId);
        } catch(error){
            console.error('Error in deleting patient', error);
        }
    }

    return {
        currentPatient, currentPatientId, patients, currentPatientAge, inputtedPatient, patientsList, 
        validInputtedPatientSpecies, validInputtedPatientWeight, currentAndInputtedWeightEqual,
        loadListOfPatients, init, setCurrentPatientId, resetInputtedPatient, validateInputtedPatient,
        addPatient, editPatient, deletePatient
    }
}