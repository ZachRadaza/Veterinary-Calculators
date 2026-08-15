<script setup>
import { ref } from 'vue';
import Dialog from './Dialog.vue';

const { optionTrue, optionFalse } = defineProps({
    title: {
        type: String,
        default: ''
    },
    descriptions: {
        type: Array,
        required: true,
        default: ['-']
    },
    optionTrue: {
        type: Object,
        required: true,
        default: () => ({
            text: '',
            action: () => {}
        })
    },
    optionFalse: {
        type: Object,
        required: true,
        default: () => ({
            text: '',
            action: () => {}
        })
    }
});

const dialog = ref(null);

function actionTrue(){
    optionTrue?.action();
    closeDialog();
}

function actionFalse(){
    optionFalse?.action();
    closeDialog();
}

function openDialog(){
    dialog.value?.dialogRef?.showModal();
}

function closeDialog(){
    dialog.value?.dialogRef?.close();
}

defineExpose({
    openDialog,
    closeDialog
})
</script>
<template>
    <Dialog
        :title="title"
        ref="dialog"    
    >
        <p 
            v-for="desc in descriptions"
            class="description"
        >{{ desc }}</p>

        <template #buttons>
            <button @click="actionTrue">{{ optionTrue.text }}</button>
            <button @click="actionFalse" class="secondary">{{ optionFalse.text }}</button>
        </template>
    </Dialog>
</template>
<style scoped>

</style>