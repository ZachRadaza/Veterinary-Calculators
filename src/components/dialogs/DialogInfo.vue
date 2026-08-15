<script setup>
import { ref } from 'vue';
import Dialog from './Dialog.vue';

defineProps({
    title: {
        type: String,
        default: ''
    },
    descriptions: {
        type: Array,
        required: true,
        default: ['-']
    }
});

const dialog = ref(null);

function openDialog(){
    dialog.value?.dialogRef?.showModal();
}

function closeDialog(){
    dialog.value?.dialogRef?.close();
}

defineExpose({
    openDialog,
    closeDialog
});
</script>
<template>
    <Dialog ref="dialog" :title="title">

        <p 
            v-for="desc in descriptions"
            class="description"
        >{{ desc }}</p>

        <template #buttons>
            <button @click="closeDialog">Close</button>
        </template>
    </Dialog>
</template>
<style scoped>
</style>