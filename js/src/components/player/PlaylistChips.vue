<template>
  <div class="playlist-bar" v-if="playlists.length">
    <button
        v-for="(pl, i) in playlists"
        :key="pl?.id ?? i"
        class="plist-chip"
        :class="{ active: i === curListIndex }"
        @click="$emit('switch', i)"
        :disabled="!pl || !Array.isArray(pl.tracks) || !pl.tracks.length"
        :title="pl?.name || `歌单 ${i+1}`"
    >
      {{ pl?.name || `歌单 ${i+1}` }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  playlists: { type: Array, required: true },
  curListIndex: { type: Number, required: true }
});
defineEmits(['switch']);
</script>

<style scoped>
.playlist-bar{
  margin-top:10px; display:flex; gap:8px; overflow:auto hidden; padding-bottom:4px;
}
.playlist-bar::-webkit-scrollbar{ height: 0; }
.plist-chip{
  border:none; outline:none; cursor:pointer;
  padding:8px 12px; border-radius:999px; background:#fff;
  box-shadow: 0 3px 10px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.7);
  font-size:12px; color:#333; transition: all .15s ease; white-space: nowrap;
}
.plist-chip[disabled]{ opacity:.5; cursor:not-allowed; }
.plist-chip.active{
  background: linear-gradient(90deg, #b5e0ff, #ffc2ee); color:#111;
  box-shadow: 0 6px 16px rgba(0,0,0,.1);
}
</style>
