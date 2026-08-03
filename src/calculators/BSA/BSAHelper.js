import { BSAConstants } from "./BSAConstants";

const BSAHelper = {
    calculateBSA(weightKg, species){
        const k = BSAConstants[species];
        if(!k || weightKg < 0)
            return null;

        return (k * Math.pow(weightKg, 2/3)) / 100;
    },

};

export default BSAHelper;