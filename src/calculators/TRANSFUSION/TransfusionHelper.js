import { TransfusionSpeciesBloodVolume } from "./TransfusionSpeciesBloodVolume";

const TransfusionHelper = {

    calculateTransfusionVolume(weightKg, species, HCTa, HCTt, HCTd){
        const bloodVolumePerKg = TransfusionSpeciesBloodVolume[species];
        const patientBloodVolume = weightKg * bloodVolumePerKg;
        const hematocritDifference = HCTt - HCTa;
        const transfusionRequired = hematocritDifference > 0;

        const transfusionVolume = transfusionRequired
            ? patientBloodVolume * (hematocritDifference / HCTd)
            : 0;

        return {
            bloodVolumePerKg,
            patientBloodVolume,
            transfusionVolume,
            transfusionRequired
        };
    }
};

export default TransfusionHelper;