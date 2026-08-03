import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import { useCalculator } from "../composables/Calculator.js";
import { CalculatorTypes } from "../calculators/CaclulatorTypes.js";
import PatientPage from "../pages/PatientPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomePage,
        },
        {
            path: "/patient",
            name: "patient",
            component: PatientPage,
        },
        {
            path: "/bsa",
            name: CalculatorTypes.BSA,
            component: CalculatorPage,
            meta: { calcType: CalculatorTypes.BSA }
        },
        {
            path: "/bromide",
            name: CalculatorTypes.BROMIDE,
            component: CalculatorPage,
            meta: { calcType: CalculatorTypes.BROMIDE }
        },
        {
            path: "/choctox",
            name: CalculatorTypes.CHOCTOX,
            component: CalculatorPage,
            meta: { calcType: CalculatorTypes.CHOCTOX }
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "/"
        }
    ],
});

router.afterEach((to) => {
    const calculator = useCalculator();
    const calcType = to.meta.calcType;

    if(calcType)
        calculator.setCurrentCalculatorType(calcType);


});

export default router;