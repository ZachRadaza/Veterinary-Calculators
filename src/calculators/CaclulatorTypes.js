import { markRaw } from "vue";
import BromideCalculator from "./BROMIDE/BromideCalculator.vue";
import BSACalculator from "./BSA/BSACalculator.vue";
import ChocolateToxicityCalculator from "./CHOCTOX/ChocolateToxicityCalculator.vue";
import FeedTubeCalculator from "./FEEDTUBE/FeedTubeCalculator.vue";
import IronSaltsCalculator from "./IRON/IronSaltsCalculator.vue";
import NSAIDToxicityCalculator from "./NSAID/NSAIDToxicityCalculator.vue";
import RodenticideToxicityCalculator from "./RODENTICIDE/RodenticideToxicityCalculator.vue";

export const CalculatorTypes = Object.freeze({
    BSA: {
        name: 'Body Surface Area',
        route: '/bsa',
        component: markRaw(BSACalculator)
    },
    BROMIDE: {
        name: 'Bromide Loading',
        route: '/bromide',
        component: markRaw(BromideCalculator)
    },
    CHOCTOX: {
        name: 'Chocolate Toxicity',
        route: '/choctox',
        component: markRaw(ChocolateToxicityCalculator)
    },
    FEEDTUBE: {
        name: 'Feeding Tube',
        route: '/feedtube',
        component: markRaw(FeedTubeCalculator)
    },
    IRON: {
        name: 'Iron Salts',
        route: '/iron',
        component: markRaw(IronSaltsCalculator)
    },
    NSAID: {
        name: 'NSAID Toxicity Calculator',
        route: '/nsaid',
        component: markRaw(NSAIDToxicityCalculator)
    },
    RODENTICIDE: {
        name: 'Rodenticide Toxicity',
        route: '/rodenticide',
        component: markRaw(RodenticideToxicityCalculator)
    }
});