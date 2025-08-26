<template>
  <div class="controls">
    <!-- 左侧：播放模式切换（本地 svg） -->
    <button
        class="icon-btn small"
        :title="modeTitle"
        aria-label="切换播放模式"
        @click="$emit('toggle-mode')"
    >
      <img v-if="playMode===0" :src="listLoop" class="ico" alt="列表循环" />
      <img v-else-if="playMode===1" :src="random" class="ico" alt="随机播放" />
      <img v-else :src="singleLoop" class="ico" alt="单曲循环" />
    </button>

    <!-- 中间：上一首 / 播放暂停 / 下一首 -->
    <div class="center-controls">
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

    <!-- 右侧：打开当前歌单曲目（保持内联 svg，做绝对居中处理） -->
    <button
        class="icon-btn small"
        title="查看当前歌单曲目"
        aria-label="查看当前歌单曲目"
        @click="$emit('open-current-tracks')"
    >
      <svg class="ico-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6h14v2H3V6zm0 5h14v2H3v-2zm0 5h9v2H3v-2zM18 6h3v11a3 3 0 1 1-2-2.83V6z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import listLoop from "@/assets/listLoop.svg";
import random from "@/assets/random.svg";
import singleLoop from "@/assets/singleLoop.svg";

const props = defineProps({
  playStates: { type: Number, required: true },
  playBtnAria: { type: String, required: true },
  playMode: { type: Number, required: true }
});
defineEmits(['prev','toggle','next','toggle-mode','open-current-tracks']);

const modeTitle = computed(() =>
    props.playMode===0 ? '列表循环' : props.playMode===1 ? '随机播放' : '单曲循环'
);
</script>

<style scoped>
.controls{
  display:grid;
  grid-template-columns: 48px 1fr 48px;
  align-items:center; gap:10px;
}
.center-controls{
  display:flex; align-items:center; justify-content:center; gap:12px;
}

/* 按钮容器 */
.icon-btn, .play-btn{
  border:none; outline:none; background:#fff; border-radius:999px;
  box-shadow: 0 10px 20px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6);
  display:grid; place-items:center;        /* 居中容器 */
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease;
  cursor:pointer;
}
.icon-btn{ width:48px; height:48px;display: flex; align-items: center; justify-content: center; }
.icon-btn.small{ width:40px; height:40px; }
.play-btn{ width:70px; height:70px; }
.icon-btn:hover, .play-btn:hover{ transform: translateY(-1px); }
.icon-btn:active, .play-btn:active{ transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,.14); }

/* ✅ 图标绝对居中：无论 img 还是 svg */
.icon-btn > *{ display:block; margin:auto; }
.ico{ width:24px; height:24px; object-fit:contain; }
.ico-svg{ width:24px; height:24px; }

/* 中间播放按钮里的 svg 尺寸 */
.icon-btn svg, .play-btn svg{ width:26px; height:26px; fill:#222; }
.play-btn svg{ width:32px; height:32px; }

@media (max-width:560px){
  .controls{ grid-template-columns: 42px 1fr 42px; gap:8px; }
  .icon-btn{ width:42px; height:42px; }
  .icon-btn.small{ width:36px; height:36px; }
  .play-btn{ width:62px; height:62px; }
  .icon-btn svg, .play-btn svg{ width:22px; height:22px; }
  .play-btn svg{ width:28px; height:28px; }
  .ico, .ico-svg{ width:20px; height:20px; }
}
</style>
