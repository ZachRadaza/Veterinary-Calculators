<script setup>
import { onMounted, ref } from 'vue';
import CalculatorTemplate from './CalculatorTemplate.vue';
import { useRoute, useRouter } from 'vue-router';
import { useCalculator } from '../composables/Calculator.js';

const { tabNames } = defineProps({
    tabNames: {
        type: Array,
        required: true,
        default: []
    }
});

const router = useRouter();
const route = useRoute();

const calculator = useCalculator();
const currentTab = ref(null);

onMounted(() => {
    const hashTab = route.hash.replace('#', '');
    for(const tab of tabNames){
        if(tab === hashTab){
            handleTabClick(tab);
            return;
        }
    }

    handleTabClick(tabNames[0]);
});

function handleTabClick(tab){
    if(tab === currentTab.value)
        return;

    currentTab.value = tab;
    router.push({ hash: `#${tab}` });
    calculator.showResults.value = false;   
}

function getCurrentTab(){
    return currentTab.value;
}

function showErrors(tab){
    return tab === currentTab.value;
}

defineExpose({
    getCurrentTab,
    showErrors
});
</script>
<template>
<CalculatorTemplate>
    <div class="flex-row tab-btns">
        <button 
            v-for="tab in tabNames" 
            :key="tab"
            @click="handleTabClick(tab)"
            :class="`tab-btn ${currentTab === tab ? 'primary' : 'secondary'}`"
        >{{ tab }}</button>
    </div>
    <div
        v-for="tab in tabNames"
        :key="`tab-${tab}`"
        v-show="currentTab === tab"
        class="tab-content flex-col"
    >
        <slot :name="tab" />
    </div>

    <template #results>
        <template 
            v-for="tab in tabNames" 
            :key="`result-${tab}`"
        >
            <div class="flex-col" v-if="currentTab === tab">
                <slot :name="`result-${tab}`" />
            </div>
        </template>
    </template>
</CalculatorTemplate>
</template>
<style>

.calc-area:has(.tab-content){
    padding: 0;
    gap: 0;
}

.tab-btns{
    margin: 1rem;
    margin-bottom: 0;
    gap: 0.5rem;
}

.tab-btn{
    padding: 0.8rem 1.5rem;
    margin: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 0;
}

.tab-content{
    background: var(--color-bg-secondary);
    padding: 1rem;
    border-top: 0.2rem solid var(--color-primary);
}

.tab-title{
    text-align: center;
}

</style>