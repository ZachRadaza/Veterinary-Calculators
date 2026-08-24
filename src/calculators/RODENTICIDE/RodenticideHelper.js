import { ChocQuantityUnits } from "../CHOCTOX/ChocQuantityUnits";
import { RodenticideTimeIngestion } from "./RodenticideTimeIngestion";
import { RodenticideTypes } from "./RodenticideTypes";

const RodenticideHelper = {

    calculateRodenticideDose(rodenticide, species, weightKg, baitQuantity, unit, timeIngestion){
        const rodenticideInfo = RodenticideTypes[rodenticide];

        if(!rodenticideInfo || !weightKg || !baitQuantity)
            return null;

        const baitGrams = unit === ChocQuantityUnits.OZ
            ? baitQuantity * 28.3495
            : baitQuantity;

        const concentrationFraction = rodenticideInfo.concentrationPercent / 100;

        const activeIngredientMg = baitGrams * concentrationFraction * 1000;

        const doseMgKg = activeIngredientMg / weightKg;

        return {
            baitGrams,
            activeIngredientMg,
            doseMgKg,
            severity: this.getRodenticideSeverity(doseMgKg, rodenticideInfo[species]),
            ingestionRecommendation: this.getIngestionRecommendation(timeIngestion)
        };
    },

    getRodenticideSeverity(doseMgKg, thresholds){

        if(!thresholds)
            return null;

        if(thresholds.severe !== null && doseMgKg > thresholds.severe)
            return 'Severe toxicity';

        if(thresholds.toxic !== null && doseMgKg >= thresholds.toxic)
            return 'Toxic exposure';

        return 'Below listed toxic dose';
    },

    getIngestionRecommendation(timeIngestion){
        switch(timeIngestion){
            case RodenticideTimeIngestion.LESS:
                return 'Recent ingestion; decontamination may be indicated if the patient is clinically appropriate.';

            case RodenticideTimeIngestion.MORE:
                return 'Ingestion occurred more than 4 hours ago; emesis may be less useful.';

            case RodenticideTimeIngestion.UNKNOWN:
                return 'Time of ingestion is unknown; assess based on rodenticide, dose, and clinical status.';

            default:
                return null;
        }
    }

};

export default RodenticideHelper;