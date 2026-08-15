<script setup>
import { ref } from 'vue';
import IconButton from '../IconButton.vue';
import CloseIcon from '../../assets/icon/CloseIcon.vue';

defineProps({
    title: {
        type: String,
        default: ''
    }
})

const dialogRef = ref(null);

defineExpose({
    dialogRef
});
</script>
<template>
    <dialog ref="dialogRef">
        <IconButton @click="dialogRef.close()" :icon="CloseIcon" class="dialog-close no-bg"/>

        <h4 v-if="title" class="title">{{ title }}</h4>

        <slot />

        <div class="btns-cont flex-row">
            <slot name="buttons"/>
        </div>
    </dialog>
</template>
<style>

dialog{
    position: relative;
    padding: 2rem;
    gap: 1.5rem;
    background: var(--color-bg);
    border-radius: 1rem;
    border: 0.1rem solid var(--color-primary);
    min-width: 300px;
}

dialog[open]{
    display: flex;
    flex-direction: column;
}

.dialog-close{
    position: absolute;
    top: 1.5rem;
    right: 1rem;
}

.btns-cont{
    align-items: center;
    justify-content: center;
}

</style>