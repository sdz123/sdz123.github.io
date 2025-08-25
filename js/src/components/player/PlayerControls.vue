<template>
  <div class="controls">
    <button class="icon-btn" @click="$emit('prev')" aria-label="上一首">
      <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM20 6v12L10 12z"/></svg>
    </button>

    <button class="play-btn" @click="$emit('toggle')" :aria-label="playBtnAria">
      <svg v-if="playStates !== 3" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      <svg v-else viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
    </button>

    <button class="icon-btn" @click="$emit('next')" aria-label="下一首">
      <svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM4 6l10 6-10 6z"/></svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  playStates: { type: Number, required: true },
  playBtnAria: { type: String, required: true }
});
defineEmits(['prev','toggle','next']);
</script>

<style scoped>
.controls{ display:flex; align-items:center; justify-content:center; gap:14px; }
.icon-btn, .play-btn{
  border:none; outline:none; background:#fff; border-radius:999px;
  box-shadow: 0 10px 20px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6);
  display:grid; place-items:center;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease;
  cursor:pointer;
}
.icon-btn{ width:52px; height:52px; }
.play-btn{ width:76px; height:76px; }
.icon-btn:hover, .play-btn:hover{ transform: translateY(-1px); }
.icon-btn:active, .play-btn:active{ transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,.14); }
.icon-btn svg, .play-btn svg{ width:28px; height:28px; fill:#222; }
.play-btn svg{ width:34px; height:34px; }
</style>
