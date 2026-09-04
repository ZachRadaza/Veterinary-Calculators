<script setup>
defineProps({
    results: {
        type: Object,
        required: true,
        default: null
    }
})

</script>
<template>
    <h5>
        {{ results.fromAmount }} {{ results.fromUnit }}
        = 
        {{ results.toAmount }} {{ results.toUnit}}
    </h5>    
</template>
<style scoped>
</style>