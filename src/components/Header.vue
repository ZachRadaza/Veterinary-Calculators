<script setup>
import { computed } from 'vue';
import { useUser } from '../composables/User';
import router, { getRouterLinkTo } from '../router';
import HomeIcon from '../assets/icon/HomeIcon.vue';
import PatientIcon from '../assets/icon/PatientIcon.vue';
import AccountIcon from '../assets/icon/AccountIcon.vue';

const user = useUser();

const username = computed(() => user.user.value?.username);

</script>
<template>
    <header>
        <RouterLink 
            :to="getRouterLinkTo('/')" 
            id="veterinary-calc-title-link"
        >
            <h4>Veterinary Calculators</h4>
        </RouterLink>
        <div class="directory">
            <RouterLink :to="getRouterLinkTo('/')">
                <HomeIcon class="background"/>
                <h5 class="page-text">Home</h5>
            </RouterLink>
            <RouterLink :to="getRouterLinkTo('/patient')">
                <PatientIcon class="background"/>
                <h5 class="page-text">Patients</h5>
            </RouterLink>
            <RouterLink :to="getRouterLinkTo('/account')">
                <AccountIcon class="background"/>
                <h5 class="page-text">{{ username ?? "Account" }}</h5>
            </RouterLink>
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
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    text-decoration: none;
    padding: 0.2rem;
    border-bottom: 0.1rem solid transparent;
    transition: border 100ms ease;
}

header a:hover{
    border-bottom-color: var(--color-bg);
}

@media (max-width: 600px){
    header{
        padding: 1rem;
    }

    #veterinary-calc-title-link{
        display: none;
    }

    .directory{
        width: 100%;
        justify-content: space-around;
    }

    header a{
        flex-direction: column;
        align-items: center;
        gap: 0.1rem;
    }

    .page-text{
        text-align: center;
    }

    .icon{
        width: 2rem;
    }
}

</style>