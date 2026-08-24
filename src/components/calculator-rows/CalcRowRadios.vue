<script setup>
import { computed } from 'vue';
import CalcRow from './CalcRow.vue';

const { isRow } = defineProps({
    label: {
        type: String,
        required: true,
        default: ''
    },
    radioOptions: {
        type: Array,
        required: true,
        default: []
    },
    isRow: {
        type: Boolean,
        default: false
    }
});

const radioContClass = computed(() => isRow ? 'radio-row' : 'radio-col');

const inputModel = defineModel();
</script>
<template>
<CalcRow :label="label">
    <div :class="radioContClass">
        <label v-for="option in radioOptions" :key="option">
            <input type="radio" v-model="inputModel" :value="option"/> {{ option }}
        </label>
    </div>
</CalcRow>
</template>
<style scoped>

.radios{
    margin-top: 0.3rem;
}

</style>