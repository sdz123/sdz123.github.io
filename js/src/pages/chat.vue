<template>
  <div class="wrap">
    <div class="top">
      <input type="text" v-model="question"  @keyup.enter="launch"> <button @click="launch">咨询</button>    <div v-if="isPending">正在询问中...</div>
    </div>
    <div class="result">
      <div v-for="(answer,i) in resultList" :key="i">
        <br/>
        {{answer}}
      </div>
    </div>
  </div>

</template>

<script setup>
import {ref,reactive} from 'vue';
import {getAnswer} from "@/util.js"
const question = ref('');
const resultList = reactive([]);
const isPending = ref(false);
const launch = async () => {
  isPending.value = true;
  resultList.push(await getAnswer(question.value));
  isPending.value = false;
}


</script>

<style scoped>
.wrap{
  min-height: 100vh;
  position: relative;
}
.top{
  position: sticky;
  top: 10px;
  background: white;
}
</style>
