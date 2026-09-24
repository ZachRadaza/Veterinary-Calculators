<script setup>
import Header from '../components/Header.vue';
import { useUser } from '../composables/User.js';

const user = useUser();

async function logout(){
    await user.logout();
    window.location.reload()
}

</script>
<template>
    <Header />
    <main>
        <h5>ACCOUNT TEMP</h5>
        <button @click="logout">Logout</button>
    </main>
</template>
<style>
</style>