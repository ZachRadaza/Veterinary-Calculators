<script setup>
import Header from '../components/Header.vue';
import PatientChooser from '../components/PatientChooser.vue';

</script>
<template>
    <Header />
    <body>
        <div class="content-wrapper">
            <div class="content-container">
                <div class="patients-area content-area">
                    <h4 class="header-title">Patients</h4>
                    <div class="patients-cont">
                        <div class="patients-list">

                        </div>
                    </div>
                    <div class="buttons-cont">
                        <button>Add Patient</button>
                        <button>Edit/View Patient</button>
                        <button>Remove Patient</button>
                        <button>Clear Section</button>
                    </div>
                </div>
                <div class="calculations-area content-area">
                    <h4 class="header-title">Calculations</h4>
                    <table class="calculations-table">

                    </table>
                    <div class="buttons-cont">
                        <button>Add Patient</button>
                        <button>Edit/View Patient</button>
                        <button>Remove Patient</button>
                        <button>Clear Section</button> 
                    </div>
                </div>
            </div>
            <PatientChooser />
        </div>
    </body>
</template>
<style scoped>

.content-wrapper{
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 0.2rem solid var(--color-primary);
    margin: 1rem;
    box-sizing: border-box;
    overflow: hidden;
}

.content-container{
    display: grid;
    grid-template-columns: 4fr 6fr;
}

.header-title{
    padding: 1rem;
    background: var(--color-secondary);
    color: var(--color-bg);
}

.content-area{
    display: flex;
    flex-direction: column;
}

.content-area :is(.patients-cont, .calculations-table){
    min-height: 400px;
}

.buttons-cont{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-top: 0.1rem solid var(--color-primary);
}

.calculations-area{
    border-left: 0.2rem solid var(--color-primary);
}

</style>