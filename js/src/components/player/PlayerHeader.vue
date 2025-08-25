<template>
  <div class="header">
    <div class="status" :class="stateClass" :title="stateLabel">
      {{ stateLabelShort }}
    </div>
    <div class="title" :title="trackTitleFull">
      {{ trackTitleFull }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  stateClass: { type: Object, required: true },
  stateLabel: { type: String, required: true },
  stateLabelShort: { type: String, required: true },
  trackTitleFull: { type: String, required: true }
});
</script>

<style scoped>
.header{
  display:grid;
  grid-template-columns: auto 1fr;
  align-items:center; gap:12px;
}
.status{
  font-size: 12px; letter-spacing:.2px; padding: 6px 10px;
  border-radius: 999px; background: rgba(0,0,0,.06);
  user-select:none; white-space: nowrap; max-width: 38vw;
  overflow: hidden; text-overflow: ellipsis;
}
.status.playing{ color:#0a7; background: rgba(0,170,119,.12); }
.status.paused{ color:#b8860b; background: rgba(184,134,11,.12); }
.status.stopped{ color:#666; }
.title{
  margin-left:auto; font-weight:600; font-size:16px; color:#222;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
@media (max-width:520px){ .status{ max-width:30vw; } }
</style>
