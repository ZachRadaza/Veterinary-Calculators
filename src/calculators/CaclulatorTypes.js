import { markRaw } from "vue";
import BromideCalculator from "./BROMIDE/BromideCalculator.vue";
import BSACalculator from "./BSA/BSACalculator.vue";
import ChocolateToxicityCalculator from "./CHOCTOX/ChocolateToxicityCalculator.vue";
import FeedTubeCalculator from "./FEEDTUBE/FeedTubeCalculator.vue";
import IronSaltsCalculator from "./IRON/IronSaltsCalculator.vue";
import NSAIDToxicityCalculator from "./NSAID/NSAIDToxicityCalculator.vue";
import RodenticideToxicityCalculator from "./RODENTICIDE/RodenticideToxicityCalculator.vue";
import SteroidConverterCalculator from "./STEROID/SteroidConverterCalculator.vue";
import TransfusionVolumeCalculator from "./TRANSFUSION/TransfusionVolumeCalculator.vue";
import UnitConversionCalculator from "./UNIT/UnitConversionCalculator.vue";

export const CalculatorTypes = Object.freeze({
    BSA: {
        name: 'Body Surface Area',
        route: '/bsa',
        component: markRaw(BSACalculator),
        calculatorId: 1
    },
    BROMIDE: {
        name: 'Bromide Loading',
        route: '/bromide',
        component: markRaw(BromideCalculator),
        calculatorId: 2
    },
    CHOCTOX: {
        name: 'Chocolate Toxicity',
        route: '/choctox',
        component: markRaw(ChocolateToxicityCalculator),
        calculatorId: 3
    },
    FEEDTUBE: {
        name: 'Feeding Tube',
        route: '/feedtube',
        component: markRaw(FeedTubeCalculator),
        calculatorId: 4
    },
    IRON: {
        name: 'Iron Salts',
        route: '/iron',
        component: markRaw(IronSaltsCalculator),
        calculatorId: 5
    },
    NSAID: {
        name: 'NSAID Toxicity Calculator',
        route: '/nsaid',
        component: markRaw(NSAIDToxicityCalculator),
        calculatorId: 6
    },
    RODENTICIDE: {
        name: 'Rodenticide Toxicity',
        route: '/rodenticide',
        component: markRaw(RodenticideToxicityCalculator),
        calculatorId: 7
    }, 
    STEROID: {
        name: 'Steroid Converter',
        route: '/steroid',
        component: markRaw(SteroidConverterCalculator),
        calculatorId: 8
    },
    TRANSFUSION: {
        name: 'Transfusion Volume',
        route: '/transfusion',
        component: markRaw(TransfusionVolumeCalculator),
        calculatorId: 9
    },
    UNIT: {
        name: 'Unit Conversion',
        route: '/unit',
        component: markRaw(UnitConversionCalculator),
        calculatorId: 10
    }
});