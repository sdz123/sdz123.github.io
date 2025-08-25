<template>
  <div class="progress">
    <span class="time">{{ formatTime(currentTime) }}</span>
    <input
        class="range"
        type="range"
        min="0"
        :max="duration || 0"
        step="0.1"
        :value="currentTime"
        @input="$emit('seek', $event.target.value)"
    />
    <span class="time">{{ formatTime(duration) }}</span>
  </div>
</template>

<script setup>
defineProps({
  duration: { type: Number, default: 0 },
  currentTime: { type: Number, default: 0 }
});
defineEmits(['seek']);

function formatTime(sec = 0) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
</script>

<style scoped>
.progress{
  margin-top:10px; display:grid; grid-template-columns:56px 1fr 56px;
  align-items:center; gap:10px;
}
.time{ font-variant-numeric: tabular-nums; font-size:12px; color:#444; text-align:center; }
.range{
  -webkit-appearance:none; appearance:none; height:8px; border-radius:999px;
  background: linear-gradient(90deg, #8ec5ff, #ffa5e3); outline:none;
}
.range::-webkit-slider-thumb{
  -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%;
  background:#fff; border:2px solid rgba(0,0,0,.08); box-shadow: 0 2px 4px rgba(0,0,0,.15); cursor:pointer;
}
</style>
