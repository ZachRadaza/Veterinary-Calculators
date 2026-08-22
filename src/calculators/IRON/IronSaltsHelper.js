import { IronSaltTypes } from "./IronSaltTypes";

const IronSaltHelper = {

    calculateElementalIron(ironSalt, amountMg){
        const elementalIronFraction = IronSaltTypes[ironSalt];

        if(elementalIronFraction === null)
            return null;

        return amountMg * elementalIronFraction;
    }
};

export default IronSaltHelper;