<script setup>
import CalcRow from './CalcRow.vue';

defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    }, 
    option1: { 
        type: Object,
        required: true,
        default: () => ({
            label: 'label1',
            value: 'val1'
        })
    },
    option2: {
        type: Object,
        required: true,
        default: () => ({
            label: 'label2',
            value: 'val2'
        })
    },
    onChange: {
        type: Function,
        default: () => {}
    }
});

const radioModel = defineModel();
</script>
<template>
    <CalcRow :label="label">
        <div class="radio-col">
            <label>
                <input type="radio" v-model="radioModel" :value="option1.value" @change="onChange"/> {{ option1.label }}
            </label>
            <label>
                <input type="radio" v-model="radioModel" :value="option2.value" @change="onChange"/> {{ option2.label }}
            </label>
        </div>
    </CalcRow>
</template>
<style scoped>
</style>