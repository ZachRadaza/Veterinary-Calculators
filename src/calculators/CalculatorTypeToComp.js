import BromideCalculator from "./BROMIDE/BromideCalculator.vue";
import BSACalculator from "./BSA/BSACalculator.vue";
import { CalculatorTypes } from "./CaclulatorTypes.js";
import ChocolateToxicityCalculator from "./CHOCTOX/ChocolateToxicityCalculator.vue";
import FeedTubeCalculator from "./FEEDTUBE/FeedTubeCalculator.vue";
import IronSaltsCalculator from "./IRON/IronSaltsCalculator.vue";

export const CalculatorTypeToComp = Object.freeze({
    [CalculatorTypes.BSA]: BSACalculator,
    [CalculatorTypes.BROMIDE]: BromideCalculator,
    [CalculatorTypes.CHOCTOX]: ChocolateToxicityCalculator,
    [CalculatorTypes.FEEDTUBE]: FeedTubeCalculator,
    [CalculatorTypes.IRON]: IronSaltsCalculator
});