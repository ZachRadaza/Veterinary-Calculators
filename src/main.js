import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { usePatient } from './composables/Patient.js';

createApp(App)
    .use(router)    
    .mount('#vet-calc-app');

initializeComposables();

async function initializeComposables(){
    const patient = usePatient();

    await Promise.all([
        patient.init()
    ]);
}