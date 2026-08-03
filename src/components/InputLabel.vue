<script setup>
defineProps({
    label: {
        type: String,
        required: true,
        default: '-'
    }
});

const inputModel = defineModel();
</script>
<template>
    <div class="input-label">
        <input v-model="inputModel"/>
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