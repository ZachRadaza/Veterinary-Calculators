<script setup>
import PatientChooser from './PatientChooser.vue';

</script>
<template>
    <div class="calculator-container">
        <PatientChooser />
        <div class="calc-area">
            <slot />
        </div>
    </div>
</template>
<style>

.calculator-container{
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 0.2rem solid var(--color-primary);
    margin: 1rem;
    overflow: hidden;
}

.calc-area{
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
}

.calc-row{
    display: grid;
    grid-template-columns: 3fr 4fr;
    gap: 2rem;
    width: 100%;
}

.calc-row >:first-child{
    text-align: right;
    vertical-align: middle;
}

.calc-row >:last-child{
    text-align: left;
}

.row-label{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
}

</style>