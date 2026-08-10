<script setup>
import CalcRow from './CalcRow.vue';

defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    },
    options: {
        type: Array,
        required: true,
        default: []
    },
    defaultOptionLabel: {
        type: String,
        default: ''
    },
    showError: {
        type: Boolean,
        default: false
    }
});

const selectModel = defineModel();
</script>
<template>
    <CalcRow :label="label">
        <select 
            v-model="selectModel" 
            :class="`${$attrs.class} ${showError ? 'error' : ''}`" 
            @change="$attrs.change"
        >
            <option v-if="defaultOptionLabel" :value="0">{{ defaultOptionLabel }}</option>
            <option v-for="op in options" :key="op" :value="op">{{ op }}</option>
        </select>
    </CalcRow>
</template>
<style scoped>
</style>