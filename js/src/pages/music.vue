<template>
  <div class="player-bg">
    <div class="player-card">
      <PlayerHeader
          :state-class="stateClass"
          :status-bar-text="statusBarText"
          :track-title-full="trackTitleFull"
          @open-drawer="openDrawer('lists')"
      />

      <div class="center">
        <div class="cover"><div class="disc"></div></div>

        <div class="right-col">
          <ProgressBar :duration="duration" :current-time="currentTime" @seek="onSeek" />

          <PlayerControls
              :play-states="playStates"
              :play-btn-aria="playBtnAria"
              :play-mode="playMode"
              @prev="prev"
              @toggle="changePlayState"
              @next="next"
              @toggle-mode="changePlayMode"
              @open-current-tracks="openDrawer('tracks')"
          />
        </div>
      </div>
    </div>

    <PlaylistDrawer
        :open="drawerOpen"
        :lists="safePlaylists"
        :current-list-index="curListIndex"
        :initial-view="drawerInitialView"
        :initial-list-index="drawerInitialListIndex"
        @close="drawerOpen = false"
        @switch="(i)=>{ switchPlaylist(i); drawerOpen=false; }"
        @play-in="(li,ti)=>{ playIn(li,ti); drawerOpen=false; }"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAudioPlayer } from "@/composables/useAudioPlayer.js";

import PlayerHeader   from "@/components/player/PlayerHeader.vue";
import PlayerControls from "@/components/player/PlayerControls.vue";
import ProgressBar    from "@/components/player/ProgressBar.vue";
import PlaylistDrawer from "@/components/player/PlaylistDrawer.vue";

const drawerOpen = ref(false);
const drawerInitialView = ref('lists');
const drawerInitialListIndex = ref(0);

const {
  safePlaylists, curListIndex,
  audio, duration, currentTime,
  playStates, playMode,
  trackTitleFull, statusBarText, stateClass, playBtnAria,
  changePlayState, next, prev, changePlayMode,
  switchPlaylist, playIn, onSeek
} = useAudioPlayer();

function openDrawer(view){
  drawerInitialView.value = view;
  drawerInitialListIndex.value = curListIndex.value;
  drawerOpen.value = true;
}
</script>

<style scoped>
/* ====== 布局容器 ====== */
.player-bg{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:
      radial-gradient(1200px 600px at 20% 10%, #e0f2ff 0%, transparent 50%),
      radial-gradient(1200px 600px at 80% 90%, #fde2ff 0%, transparent 50%),
      linear-gradient(135deg, #f6f9fc, #eef2f7);
  padding:20px;
  overflow-x:hidden;
  box-sizing:border-box; /* ✅ 你提到的修复：携带 */
}

.player-card{
  width: min(720px, 92vw);
  border-radius:20px;
  padding:18px 18px 16px;
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,.7);
  box-shadow: 0 10px 30px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6);
}

/* ====== 中部：左=封面；右=进度+控制 ====== */
.center{
  display:grid;
  grid-template-columns: 150px 1fr;
  gap:16px;
  margin-top:14px;
}
.right-col{
  display:flex;
  flex-direction:column;
  gap:10px;
  justify-content: space-between; /* ✅ 保留你的设置 */
}

/* ====== 移动端：顶部 1/4 屏，不再垂直居中 ====== */
@media (max-width:560px){
  .player-bg{
    align-items:flex-start;   /* 顶部对齐 */
    justify-content:center;   /* 水平居中 */
    padding-top:5vh;         /* ✅ 顶部距离为屏幕高度的 1/4 */
    box-sizing: border-box;
    overflow: hidden;
  }
  .player-card{
    width: min(460px, 94vw);
    padding:14px;
    border-radius:16px;
  }
  .center{
    grid-template-columns: 1fr;
    gap:12px;
  }
}

/* ====== 封面 ====== */
.cover{
  display:flex; align-items:center; justify-content:center;
  aspect-ratio:1/1; border-radius:16px;
  background: linear-gradient(145deg,#ffffff,#e9eef6);
  box-shadow: inset 8px 8px 16px #d6dbe2, inset -8px -8px 16px #ffffff;
}
.disc{
  width:70%; aspect-ratio:1/1; border-radius:50%;
  background:
      radial-gradient(closest-side,#fff 0 20%, #222 20% 21%, #ddd 22% 60%, #bbb 60% 61%, #999 62% 100%);
  animation: spin 6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<!-- 防止偶发横向滚动条 -->
<style>
html, body { margin:0; overflow-x:hidden; }
</style>

