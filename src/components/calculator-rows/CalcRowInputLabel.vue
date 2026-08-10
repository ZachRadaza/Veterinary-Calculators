<script setup>
import InputLabel from '../InputLabel.vue';
import CalcRow from './CalcRow.vue';

defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    },
    inputLabel: {
        type: String,
        required: true,
        default: '-'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    }
});

const inputModel = defineModel();
</script>
<template>
    <CalcRow :label="label">
        <InputLabel 
            :label="inputLabel" 
            v-model="inputModel" 
            :disabled="disabled" 
            :error="error"
            :class="`${$attrs.class}`"
            @input="$attrs.onInput"
        />
    </CalcRow>
</template>
<style scoped>
</style>