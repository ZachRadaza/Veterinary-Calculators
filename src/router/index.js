import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import CalculatorPage from "../pages/CalculatorPage.vue";
import { useCalculator } from "../composables/Calculator.js";
import { CalculatorTypes } from "../calculators/CaclulatorTypes.js";
import PatientPage from "../pages/PatientPage.vue";
import AccountPage from "../pages/AccountPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import { useUser } from "../composables/User.js";
import { usePatient } from "../composables/Patient.js";

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
            path: "/account",
            name: "account",
            component: AccountPage,
        },
        {
            path: "/login",
            name: "login",
            component: LoginPage,
        },
        {
            path: "/signup",
            name: "signup",
            component: SignUpPage,
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

router.beforeEach((to, from) => {
    const user = useUser();

    if(to.name === 'account'){
        if(!user.isLoggedIn.value){
            return { name: 'login', query: { redirect: from.fullPath}};
        }
    }
})

router.afterEach((to) => {
    const calculator = useCalculator();
    const patient = usePatient();
    const calcType = to.meta.calcType;

    patient.setCurrentPatientId(to.query?.patientId);

    if(calcType)
        calculator.setCurrentCalculatorType(calcType);

});

export function getRouterLinkTo(path){
    const patId = router.currentRoute.value.query.patientId;
    return { path: path, query: { patientId: patId } };
}

export default router;