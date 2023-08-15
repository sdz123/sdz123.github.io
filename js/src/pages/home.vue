<template>
  <input type="text" v-model="inputValue">
  <button @click="enter">进入</button>
</template>

<style scoped>

</style>
<script setup>
import {ref} from 'vue';
// import axios from 'axios';
import Chat from '@/pages/chat.vue';
import Links from '@/pages/links.vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const inputValue = ref("");
// const enter = async () => {
//   const result = await axios.get(`https://m-server.azurewebsites.net/test/${inputValue.value}`);
//   if(result.data === "haha"){
//     router.addRoute({path:'/chat',component: Chat});
//     router.addRoute({path:'/links',component: Links});
//     router.push('/links');
//   }else {
//     alert('密码错误')
//   }
// }

</script>
