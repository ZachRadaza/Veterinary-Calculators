<script setup>
import { computed } from 'vue';
import { useUser } from '../composables/User';

const user = useUser();

const username = computed(() => user.user.value?.username);

</script>
<template>
    <header>
        <RouterLink to="/"><h4>Veterinary Calculators</h4></RouterLink>
        <div class="directory">
            <RouterLink to="/"><h5>Home</h5></RouterLink>
            <RouterLink to="/patient"><h5>Patients</h5></RouterLink>
            <RouterLink to="/account"><h5>{{ username ?? "Account" }}</h5></RouterLink>
        </div>
    </header>
</template>
<style scoped>

header{
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    background: var(--color-primary);
}

.directory{
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: center;
    justify-content: center;
}

header :is(h4, h5){
    color: var(--color-bg);
}

header a{
    text-decoration: none;
    padding: 0.2rem;
    border-bottom: 0.1rem solid transparent;
    transition: border 100ms ease;
}

header a:hover{
    border-bottom-color: var(--color-bg);
}

</style>