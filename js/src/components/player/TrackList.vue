<template>
  <transition name="collapse">
    <ul v-show="show" class="track-list" role="listbox" :aria-label="`歌单 ${name}`">
      <li
          v-for="(t, i) in tracks"
          :key="t?.id ?? i"
          class="track-item"
          :class="{
          active: i === curIndex,
          playing: playStates === 3 && i === curIndex,
          paused : playStates === 2 && i === curIndex
        }"
          role="option"
          :aria-selected="i === curIndex"
          @click="$emit('pick', i)"
      >
        <span class="idx">{{ i+1 }}</span>
        <span class="t-title" :title="t?.title || titleFromUrl(t?.url)">
          {{ t?.title || titleFromUrl(t?.url) }}
        </span>
        <span class="t-artist" v-if="t?.artist">{{ t.artist }}</span>
        <span class="badge" v-if="i === curIndex">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="playStates === 3" d="M8 5v14l11-7z"/>
            <path v-else d="M6 5h4v14H6zM14 5h4v14h-4z"/>
          </svg>
        </span>
      </li>
    </ul>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  name: { type: String, default: '' },
  tracks: { type: Array, default: () => [] },
  curIndex: { type: Number, default: 0 },
  playStates: { type: Number, default: 1 }
});
defineEmits(['pick']);

function titleFromUrl(url){
  try{
    const name = decodeURIComponent(String(url||'').split('/').pop() || "未命名音频");
    return name.replace(/\.(mp3|wav|m4a|ogg|flac)$/i, "");
  }catch{ return "未命名音频"; }
}
</script>

<style scoped>
.track-list{
  margin-top:8px; list-style:none; padding:6px; margin-bottom:0;
  background: rgba(255,255,255,.72); border:1px solid rgba(0,0,0,.06);
  border-radius:14px; max-height:240px; overflow:auto;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.55);
}
.track-item{
  display:grid; grid-template-columns: 28px 1fr auto auto;
  align-items:center; gap:8px; padding:8px 10px; border-radius:10px;
  cursor:pointer; transition: background .12s ease, transform .06s ease;
}
.track-item:hover{ background: rgba(0,0,0,.035); }
.track-item:active{ transform: translateY(1px); }
.idx{ font-size:12px; color:#777; text-align:right; }
.t-title{ font-size:14px; color:#222; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.t-artist{ font-size:12px; color:#666; margin-left:6px; white-space:nowrap; }
.badge svg{ width:18px; height:18px; fill:#111; opacity:.85; }
.track-item.active{ background: linear-gradient(90deg, #b5e0ff44, #ffc2ee44); }
.track-item.playing .t-title{ font-weight:600; }
.track-item.paused  .t-title{ font-weight:600; opacity:.9; }

/* 折叠动画 */
.collapse-enter-from, .collapse-leave-to{ max-height: 0; opacity: 0; }
.collapse-enter-active, .collapse-leave-active{
  transition: max-height .25s ease, opacity .2s ease;
}
</style>
