<script setup>
defineProps({
    amountFrom: {
        type: Number,
        required: true,
        default: 0
    },
    amountTo: {
        type: Number,
        required: true,
        default: 0
    },
    unitFrom: {
        type: String,
        required: true,
        default: ''
    },
    unitTo: {
        type: String,
        required: true,
        default: ''
    }
})

</script>
<template>
    <h5>
        {{ amountFrom }} {{ unitFrom }}
        = 
        {{ amountTo }} {{ unitTo}}
    </h5>    
</template>
<style scoped>
</style>