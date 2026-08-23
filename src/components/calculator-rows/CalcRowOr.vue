<script setup>
import { ref } from 'vue';
import CalcRow from './CalcRow.vue';

defineProps({
    label: {
        type: String,
        required: true,
        default: ''
    },
    option1Value: {
        required: true        
    },
    option2Value: {
        required: true        
    }
});

const radioModel = defineModel();
</script>
<template>
    <CalcRow :label="label">
        <div class="flex-col">

            <div class="radio-div">
                <input type="radio" :value="option1Value" v-model="radioModel"/>
                <slot name="option1" />
            </div>

            <h6> - OR - </h6>

            <div class="radio-div">
                <input type="radio" :value="option2Value" v-model="radioModel"/>
                <slot name="option2" />
            </div>
            
        </div>
    </CalcRow>
</template>
<style scoped>
</style>