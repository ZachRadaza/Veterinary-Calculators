import { PatientSpecies } from "../../utils/PatientSpecies";

export const RodenticideTypes = Object.freeze({
    ['Bromethalin (0.01%)']: {
        concentrationPercent: 0.01,
        [PatientSpecies.DOG]: { toxic: 0.24 },
        [PatientSpecies.CAT]: { toxic: 0.04 }
    },
    ['Anticoagulant (0.005%)']: {
        concentrationPercent: 0.005,
        [PatientSpecies.DOG]: { toxic: null },
        [PatientSpecies.CAT]: { toxic: null }
    },
    ['Cholecalciferol (0.075%)']: {
        concentrationPercent: 0.075,
        [PatientSpecies.DOG]: { toxic: 0.1, severe: 0.5 },
        [PatientSpecies.CAT]: { toxic: 0.1, severe: 0.5 }
    }
});