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

export function usePatient(){
    
    async function init(){
        await loadListOfPatients();
    }

    async function loadListOfPatients(){
        const patientsList = await PatientService.getPatients('');
        const patientsMap = new Map();

        patientsList.map((patients) => {
            patientsMap.set(patients.id, patients);
        });

        _patients.value = patientsMap;
    }

    function setCurrentPatientId(patientId){
        _currentPatientId.value = patientId;

        inputtedPatient.value = JSON.parse(JSON.stringify(currentPatient.value));
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

    return {
        currentPatient, currentPatientId, patients, currentPatientAge, inputtedPatient, patientsList,
        loadListOfPatients, init, setCurrentPatientId, resetInputtedPatient
    }
}