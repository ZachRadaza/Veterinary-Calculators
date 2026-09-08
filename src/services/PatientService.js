import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { USERS_COLLECTION } from "./UsersService";

const PATIENT_COLLECTION = 'patients';

const PatientService = {
    
    async getPatients(uid){
        if(!uid)
            return [];

        const patientsRef = collection(db, USERS_COLLECTION, uid, PATIENT_COLLECTION);

        const snapshot = await getDocs(patientsRef);

        return snapshot.docs.map(patientDoc => ({
            id: patientDoc.id,
            ...patientDoc.data()
        }));
    },

    async addPatient(userId, name, species, breed, weight, sex, dateOfBirth, patientNum, clientName, color, comments){
        if(!name || !species || !breed || !weight || !sex || !dateOfBirth)//required att
            throw new Error('Missing values');

        const patient = { name, species, breed, weight, sex, dateOfBirth, patientNum, clientName, color, comments };

        const patientsRef = collection(db, USERS_COLLECTION, userId, PATIENT_COLLECTION);

        const newPatient = await addDoc(patientsRef, patient);

        return {
            id: newPatient.id,
            ...patient
        };
    },

    async updatePatient(userId, patientId, patient){
        if(!userId || !patientId || !patient)
            throw new Error('User Id, Patient Id, or patient not passed');

        const patientsRef = doc(db, USERS_COLLECTION, userId, PATIENT_COLLECTION, patientId);

        await updateDoc(patientsRef, patient);

        return {
            id: patientId,
            ...patient
        }
    },

    async deletePatient(userId, patientId){
        if(!userId || !patientId)
            throw new Error('User Id or Patient Id not passed');

        const patientsRef = doc(db, USERS_COLLECTION, userId, PATIENT_COLLECTION, patientId);

        await deleteDoc(patientsRef);
    }
};

export default PatientService;