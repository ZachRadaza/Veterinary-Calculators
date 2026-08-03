import BromideCalculator from "./BROMIDE/BromideCalculator.vue";
import BSACalculator from "./BSA/BSACalculator.vue";
import { CalculatorTypes } from "./CaclulatorTypes.js";
import ChocolateToxicityCalculator from "./CHOCTOX/ChocolateToxicityCalculator.vue";

export const CalculatorTypeToComp = Object.freeze({
    [CalculatorTypes.BSA]: BSACalculator,
    [CalculatorTypes.BROMIDE]: BromideCalculator,
    [CalculatorTypes.CHOCTOX]: ChocolateToxicityCalculator,
});