<template>
  <div class="bottom">
    <div class="modes">
      <button class="chip" :class="{active: playMode===0}" @click="$emit('mode', 0)">列表循环</button>
      <button class="chip" :class="{active: playMode===1}" @click="$emit('mode', 1)">随机播放</button>
      <button class="chip" :class="{active: playMode===2}" @click="$emit('mode', 2)">单曲循环</button>
    </div>

    <div class="volume">
      <svg viewBox="0 0 24 24" class="vol-ico"><path d="M4 9v6h4l5 5V4L8 9H4z"/></svg>
      <input class="range small" type="range" min="0" max="1" step="0.01" :value="volume" @input="$emit('volume', $event.target.value)" />
    </div>

    <div class="actions">
      <button class="ghost" @click="$emit('replay')">再听1遍</button>
      <button class="ghost danger" @click="$emit('stop')">停止</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  playMode: { type: Number, required: true },
  volume:   { type: Number, required: true }
});
defineEmits(['mode','volume','replay','stop']);
</script>

<style scoped>
.bottom{
  margin-top:12px; display:grid; grid-template-columns:1fr auto auto; gap:12px; align-items:center;
}
@media (max-width:680px){ .bottom{ grid-template-columns:1fr; } }
.modes{ display:flex; flex-wrap:wrap; gap:8px; }
.chip{
  border:none; outline:none; cursor:pointer; padding:8px 12px; border-radius:999px; background:#fff;
  box-shadow: 0 3px 10px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.7);
  font-size:12px; color:#333; transition: all .15s ease;
}
.chip.active{ background: linear-gradient(90deg, #b5e0ff, #ffc2ee); color:#111; box-shadow: 0 6px 16px rgba(0,0,0,.1); }
.chip:active{ transform: translateY(1px); }
.volume{ display:flex; align-items:center; gap:8px; min-width:180px; }
.vol-ico{ width:18px; height:18px; fill:#333; }
.actions{ display:flex; gap:8px; justify-content:flex-end; }
.ghost{
  border:1px solid rgba(0,0,0,.08); background: transparent; padding:8px 12px; border-radius:10px;
  cursor:pointer; transition: background .15s ease;
}
.ghost:hover{ background: rgba(0,0,0,.04); }
.ghost.danger{ color:#b00020; border-color: rgba(176,0,32,.25); }
.ghost.danger:hover{ background: rgba(176,0,32,.06); }
.range{
  -webkit-appearance:none; appearance:none; height:6px; border-radius:999px; background: linear-gradient(90deg, #8ec5ff, #ffa5e3);
}
.range::-webkit-slider-thumb{
  -webkit-appearance:none; appearance:none; width:14px; height:14px; border-radius:50%;
  background:#fff; border:2px solid rgba(0,0,0,.08); box-shadow: 0 2px 4px rgba(0,0,0,.15); cursor:pointer;
}
</style>
