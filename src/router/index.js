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
        ...Object.values(CalculatorTypes).map((calculator) => ({
            path: calculator.route,
            name: calculator.name,
            component: CalculatorPage,
            meta: { calcType: calculator }
        })),
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