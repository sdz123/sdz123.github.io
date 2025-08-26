<template>
  <transition name="fade">
    <div v-if="open" class="drawer-mask" @click.self="$emit('close')"></div>
  </transition>

  <transition name="slide-up">
    <section v-if="open" class="drawer-panel" role="dialog" aria-modal="true">
      <header class="drawer-header">
        <button v-if="view==='tracks'" class="link" @click="view='lists'">← 返回歌单</button>
        <div class="title">{{ view==='lists' ? '选择歌单' : `歌单：${lists[activeListIndex]?.name || ''}` }}</div>
        <button class="link" @click="$emit('close')">关闭</button>
      </header>

      <!-- 歌单列表 -->
      <ul v-if="view==='lists'" class="list">
        <li
            v-for="(pl,i) in lists"
            :key="pl?.id ?? i"
            class="row"
            :class="{ disabled: !(pl?.tracks?.length > 0) }"
            :aria-disabled="!(pl?.tracks?.length > 0)"
            @click="onRowClick(i, pl)"
        >
          <div class="left">
            <div class="name">{{ pl?.name || `歌单 ${i+1}` }}</div>
            <div class="meta">{{ (pl?.tracks?.length || 0) }} 首</div>
          </div>
          <button class="right link" @click.stop="openTracks(i)">查看歌单</button>
        </li>
      </ul>

      <!-- 曲目列表 -->
      <ul v-else class="list">
        <li v-for="(t,ti) in (lists[activeListIndex]?.tracks || [])"
            :key="t?.id ?? ti" class="row"
            @click="$emit('play-in', activeListIndex, ti)">
          <div class="left">
            <div class="name">{{ t?.title || titleFromUrl(t?.url) }}</div>
            <div class="meta">#{{ ti+1 }}</div>
          </div>
          <button class="right link" @click.stop="$emit('play-in', activeListIndex, ti)">播放</button>
        </li>
      </ul>
    </section>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  open:   { type: Boolean, default: false },
  lists:  { type: Array, required: true },
  currentListIndex: { type: Number, default: 0 },
  initialView: { type: String, default: 'lists' },       // 'lists' | 'tracks'
  initialListIndex: { type: Number, default: 0 }
});
const emit = defineEmits(['close','switch','play-in']);

const view = ref('lists');
const activeListIndex = ref(0);

const resetState = () => {
  view.value = (props.initialView === 'tracks') ? 'tracks' : 'lists';
  activeListIndex.value = Number.isInteger(props.initialListIndex)
      ? props.initialListIndex
      : (props.currentListIndex || 0);
};

watch(() => props.open, (v) => { if (v) resetState(); });
watch(() => [props.initialView, props.initialListIndex], () => {
  if (props.open) resetState();
});

// 点击整行：仅当歌单有歌时才允许切换
function onRowClick(i, pl){
  const hasSongs = Array.isArray(pl?.tracks) && pl.tracks.length > 0;
  if (!hasSongs) return;
  emit('switch', i);
}
function openTracks(i){ activeListIndex.value = i; view.value = 'tracks'; }

function titleFromUrl(url){
  try{
    const name = decodeURIComponent(String(url||'').split('/').pop() || "未命名音频");
    return name.replace(/\.(mp3|wav|m4a|ogg|flac)$/i, "");
  }catch{ return "未命名音频"; }
}
</script>

<style scoped>
.drawer-mask{ position:fixed; inset:0; background:rgba(0,0,0,.25); backdrop-filter: blur(1px); z-index:999; }
.drawer-panel{
  position:fixed; left:0; right:0; bottom:0; z-index:1000;
  background:#fff; border-top-left-radius:18px; border-top-right-radius:18px;
  box-shadow: 0 -8px 30px rgba(0,0,0,.12);
  max-height: 70vh; overflow:auto;
}
.drawer-header{
  position:sticky; top:0; display:flex; align-items:center; justify-content:space-between; gap:10px;
  padding:12px 14px; border-bottom:1px solid rgba(0,0,0,.06); background:#fff; border-top-left-radius:18px; border-top-right-radius:18px;
}
.drawer-header .title{ font-weight:600; }
.link{
  background:transparent; border:none; color:#275; cursor:pointer; padding:6px 8px; border-radius:8px;
}
.link:hover{ background:rgba(0,0,0,.05); }

.list{ list-style:none; padding: 6px; margin:0; }
.row{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  padding:10px 12px; border-radius:12px; cursor:pointer;
  transition: background .12s ease, transform .06s ease, opacity .15s ease;
}
.row:hover{ background: rgba(0,0,0,.035); }
.row:active{ transform: translateY(1px); }
.row.disabled{ opacity:.5; cursor:not-allowed; }
.left .name{ font-size:14px; color:#222; }
.left .meta{ font-size:12px; color:#777; }
.right.link{ color:#0366d6; }
.right.link:hover{ background: rgba(3, 102, 214, .08); }

.fade-enter-from, .fade-leave-to{ opacity:0 }
.fade-enter-active, .fade-leave-active{ transition: opacity .2s ease; }
.slide-up-enter-from, .slide-up-leave-to{ transform: translateY(100%); }
.slide-up-enter-active, .slide-up-leave-active{ transition: transform .25s ease; }
</style>
