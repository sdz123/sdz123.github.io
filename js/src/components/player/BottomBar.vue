<template>
  <div class="bottom">
    <div class="modes">
      <button class="chip" :class="{active: playMode===0}" @click="$emit('mode', 0)">列表循环</button>
      <button class="chip" :class="{active: playMode===1}" @click="$emit('mode', 1)">随机播放</button>
      <button class="chip" :class="{active: playMode===2}" @click="$emit('mode', 2)">单曲循环</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  playMode: { type: Number, required: true }
});
defineEmits(['mode']);
</script>

<style scoped>
.bottom{
  margin-top:12px;
  display:grid; grid-template-columns:1fr; gap:12px; align-items:center;
}
.modes{ display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-start; }
.chip{
  border:none; outline:none; cursor:pointer;
  padding:8px 12px; border-radius:999px; background:#fff;
  box-shadow: 0 3px 10px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.7);
  font-size:12px; color:#333; transition: all .15s ease;
}
.chip.active{
  background: linear-gradient(90deg, #b5e0ff, #ffc2ee); color:#111;
  box-shadow: 0 6px 16px rgba(0,0,0,.1);
}
.chip:active{ transform: translateY(1px); }
</style>
