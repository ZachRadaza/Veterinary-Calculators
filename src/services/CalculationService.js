import { addDoc, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../Firebase";
import { USERS_COLLECTION } from "./UsersService";
import { PATIENT_COLLECTION } from "./PatientService";

export const CALCULATION_COLLECTION = 'calculations';

const CalculationService = {

    validateId(id){
        if(typeof id === 'number')
            return id > 0;

        return id && typeof id === 'string';
    },

    async getCalculations(userId, patientId){
        if(!userId || !this.validateId(patientId))
            return [];

        const calculationRef = collection(
            db,
            USERS_COLLECTION,
            userId,
            PATIENT_COLLECTION,
            patientId,
            CALCULATION_COLLECTION
        );

        const snapshot = await getDocs(calculationRef);

        return snapshot.docs.map(calculationDoc => ({
            id: calculationDoc.id,
            title: calculationDoc.data().title,
            comments: calculationDoc.data().comments,
            calculatorId: calculationDoc.data().calculatorId,
            patientId: calculationDoc.data().patientId
        }));
    },

    async getCalculatorCalculations(userId, patientId, calculatorId){
        if(!userId || !this.validateId(patientId) || !this.validateId(calculatorId))
            return [];

        const calculationRef = collection(
            db,
            USERS_COLLECTION,
            userId,
            PATIENT_COLLECTION,
            patientId,
            CALCULATION_COLLECTION
        );

        const qWhere = where('calculatorId', '==', calculatorId);
        const qOrderBy = orderBy('createdAt', 'asc');
        const qQuery = query(calculationRef, qWhere, qOrderBy);

        const snapshot = await getDocs(qQuery);

        return snapshot.docs.map(calculationDoc => ({
            id: calculationDoc.id,
            title: calculationDoc.data().title,
            calculatorId: calculationDoc.data().calculatorId,
            patientId: calculationDoc.data().patientId
        }));
    },

    async getCalculation(userId, patientId, calculationId){
        if(!userId || !this.validateId(patientId) || !this.validateId(calculationId))
            return [];

        const calculationDoc = doc(
            db,
            USERS_COLLECTION,
            userId,
            PATIENT_COLLECTION,
            patientId,
            CALCULATION_COLLECTION,
            calculationId
        );

        const calculation = await getDoc(calculationDoc);

        return {
            id: calculation.id,
            ...calculation.data()
        };
    },

    async getCalculationNoPatientId(userId, calculationId) {
        if(!userId || !this.validateId(calculationId))
            return null;

        const calculationQuery = query(
            collectionGroup(db, CALCULATION_COLLECTION),
            where('userId', '==', userId),
            where('calculationId', '==', calculationId),
            limit(1)
        );

        const snapshot = await getDocs(calculationQuery);

        if(snapshot.empty)
            return null;

        const calculationDoc = snapshot.docs[0];

        return {
            id: calculationDoc.id,
            ...calculationDoc.data()
        }
    },

    async addCalculation(userId, patientId, title, comments, calculationValues, calculatorId){
        if(!userId || !this.validateId(patientId) || !title || !calculationValues)
            throw new Error('Missing fields to add calculations');

        const calculation = {
            title,
            comments,
            calculationValues,
            patientId,
            createdAt: new Date(),
            calculatorId
        };

        const calculationRef = collection(
            db,
            USERS_COLLECTION,
            userId,
            PATIENT_COLLECTION,
            patientId,
            CALCULATION_COLLECTION
        );

        const calculationNew = await addDoc(calculationRef, calculation);

        return {
            id: calculationNew.id,
            ...calculation
        };
    },

    async updateCalculation(userId, patientId, calculationId, calculation){
        if(!userId || !this.validateId(patientId) || !this.validateId(calculationId) || !calculation)
            throw new Error('Missing fields to updated calculations');

        const calculationDoc = doc(
            db,
            USERS_COLLECTION,
            userId,
            PATIENT_COLLECTION,
            patientId,
            CALCULATION_COLLECTION,
            calculationId
        );

        const calculationUpdated = await updateDoc(calculationDoc, calculation);

        return {
            id: calculationId,
            ...calculation
        }
    },

    async deleteCalculation(userId, patientId, calculationId){
        if(!userId || !this.validateId(patientId) || !this.validateId(calculationId))
            throw new Error('Missing fields to delete calculations');

        const calculationDoc = doc(
            db,
            USERS_COLLECTION,
            userId,
            PATIENT_COLLECTION,
            patientId,
            CALCULATION_COLLECTION,
            calculationId
        );

        await deleteDoc(calculationDoc);
    }

};

export default CalculationService;