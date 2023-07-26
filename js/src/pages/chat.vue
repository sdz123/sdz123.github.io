<template>
  <input type="text" v-model="question">
  <div v-for="(answer,i) in resultList" :key="i">{{answer}}</div>
  <button @click="getAnswer" @keydown.enter="getAnswer">咨询</button>
</template>

<script setup>
import {ref,reactive} from 'vue';
const question = ref('');
const resultList = reactive([]);
import axios from 'axios';
const getAnswer = async () => {
    const result = await axios.get(`https://m-server.azurewebsites.net/getAnswer/${question.value}`);
    resultList.push(result.data);

}

</script>

<style scoped>

</style>
