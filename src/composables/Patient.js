import { computed, ref } from "vue";
import PatientService from "../services/PatientService";
import { PatientSpecies } from "../utils/PatientSpecies";

const _currentPatientId = ref(0);
const _patients = ref(new Map());
const inputtedPatient = ref(null);

const currentPatientId = computed(() => _currentPatientId.value);
const patients = computed(() => [..._patients.value]);
const patientsList = computed(() => 
    [..._patients.value?.values()]
);
const currentPatient = computed(() => _patients.value.get(_currentPatientId.value) ?? null);
const currentPatientAge = computed(() => currentPatient.value.dob);

const validInputtedPatientWeight = computed(() => inputtedPatient?.value?.weight > 0);
const validInputtedPatientSpecies = computed(() => Object.values(PatientSpecies).includes(inputtedPatient?.value?.species));

export function usePatient(){
    
    async function init(){
        await loadListOfPatients();
    }

    async function loadListOfPatients(){
        try{
            const patientsList = await PatientService.getPatients('');
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

        inputtedPatient.value = JSON.parse(JSON.stringify(currentPatient.value));
        
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

    return {
        currentPatient, currentPatientId, patients, currentPatientAge, inputtedPatient, patientsList, 
        validInputtedPatientSpecies, validInputtedPatientWeight,
        loadListOfPatients, init, setCurrentPatientId, resetInputtedPatient, validateInputtedPatient
    }
}