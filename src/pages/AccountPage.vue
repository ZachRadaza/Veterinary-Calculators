<script setup>
import { useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import { useUser } from '../composables/User.js';

const user = useUser();
const router = useRouter();

async function logout(){
    await user.logout();
    router.push({ name: 'home' });
}

</script>
<template>
    <Header />
    <body>
        <h5>ACCOUNT TEMP</h5>
        <button @click="logout">Logout</button>
    </body>
</template>
<style>
</style>