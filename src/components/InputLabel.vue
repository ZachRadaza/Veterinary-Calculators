<script setup>
defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const inputModel = defineModel();
</script>
<template>
    <div class="input-label">
        <input v-model="inputModel" :disabled="disabled"/>
        <h6>{{ label }}</h6>
    </div>
</template>
<style scoped>

.input-label{
    display: flex;
    flex-direction: row;
    gap: 1ch;
    align-items: center;
}

.input-label.short input{
    width: 100px;
}

</style>