<template>
  <div class="playlist-tools" v-if="trackCount">
    <button class="ghost" @click="$emit('toggle')">
      {{ showList ? '收起歌单' : '查看歌单' }}
    </button>
    <span class="list-meta">{{ name }} · 共 {{ trackCount }} 首</span>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: '当前歌单' },
  trackCount: { type: Number, default: 0 },
  showList: { type: Boolean, default: false }
});
defineEmits(['toggle']);
</script>

<style scoped>
.playlist-tools{ margin-top:6px; display:flex; align-items:center; gap:10px; }
.ghost{
  border:1px solid rgba(0,0,0,.08); background: transparent;
  padding:6px 10px; border-radius:999px; cursor:pointer; transition: background .15s ease;
}
.ghost:hover{ background: rgba(0,0,0,.04); }
.list-meta{ font-size:12px; color:#666; }
</style>
