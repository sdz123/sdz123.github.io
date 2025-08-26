<template>
  <div class="controls">
    <!-- 左侧：播放模式切换（图标展示） -->
    <button
        class="icon-btn small"
        :title="modeTitle"
        aria-label="切换播放模式"
        @click="$emit('toggle-mode')"
    >
      <!-- 列表循环 -->
      <svg v-if="playMode===0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7h10a3 3 0 0 1 0 6h-1v-2h1a1 1 0 0 0 0-2H7l2-2-1.4-1.4L3.2 9.2l4.4 4.4L9 12l-2-2zM17 17H7a3 3 0 0 1 0-6h1v2H7a1 1 0 0 0 0 2h10l-2 2 1.4 1.4 4.4-4.4-4.4-4.4L15 9l2 2z"/>
      </svg>
      <!-- 随机播放 -->
      <svg v-else-if="playMode===1" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.59 7.41 13.17 6 9 10.17 6.83 8H4v2h2.83L11 13.17l4.59-4.58zM20 6h-6v2h6v6h2V6zM4 14h2.83l2.58 2.59L13.17 18 9 13.83 6.83 16H4zM20 16h-2v2h-2v2h4v-4z"/>
      </svg>
      <!-- 单曲循环 -->
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 7h7V4l5 4-5 4V9H7a3 3 0 1 0 0 6h5v2H7a5 5 0 1 1 0-10zm11 4h-2v6h2v-6z"/>
        <text x="16.5" y="18" font-size="8" text-anchor="middle" dominant-baseline="middle">1</text>
      </svg>
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

    <!-- 右侧：直接打开“当前歌单曲目”面板 -->
    <button
        class="icon-btn small"
        title="查看当前歌单曲目"
        aria-label="查看当前歌单曲目"
        @click="$emit('open-current-tracks')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6h14v2H3V6zm0 5h14v2H3v-2zm0 5h9v2H3v-2zM18 6h3v11a3 3 0 1 1-2-2.83V6z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  playStates: { type: Number, required: true },
  playBtnAria: { type: String, required: true },
  playMode: { type: Number, required: true } // 0 列表循环 1 随机 2 单曲
});
defineEmits(['prev','toggle','next','toggle-mode','open-current-tracks']);

const modeTitle = computed(() =>
    props.playMode===0 ? '列表循环' : props.playMode===1 ? '随机播放' : '单曲循环'
);
</script>

<style scoped>
.controls{
  display:grid;
  grid-template-columns: 48px 1fr 48px;  /* 稍收窄 */
  align-items:center; gap:10px;
}
.center-controls{
  display:flex; align-items:center; justify-content:center; gap:12px;
}

/* 按钮尺寸（默认） */
.icon-btn, .play-btn{
  border:none; outline:none; background:#fff; border-radius:999px;
  box-shadow: 0 10px 20px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6);
  display:grid; place-items:center;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease;
  cursor:pointer;
}
.icon-btn{ width:48px; height:48px; }
.icon-btn.small{ width:40px; height:40px; }
.play-btn{ width:70px; height:70px; }
.icon-btn:hover, .play-btn:hover{ transform: translateY(-1px); }
.icon-btn:active, .play-btn:active{ transform: translateY(0); box-shadow: 0 4px 12px rgba(0,0,0,.14); }
.icon-btn svg, .play-btn svg{ width:26px; height:26px; fill:#222; }
.play-btn svg{ width:32px; height:32px; }

/* 移动端进一步变小，避免过宽导致滚动条 */
@media (max-width:560px){
  .controls{ grid-template-columns: 42px 1fr 42px; gap:8px; }
  .icon-btn{ width:42px; height:42px; }
  .icon-btn.small{ width:36px; height:36px; }
  .play-btn{ width:62px; height:62px; }
  .icon-btn svg, .play-btn svg{ width:22px; height:22px; }
  .play-btn svg{ width:28px; height:28px; }
}
</style>
