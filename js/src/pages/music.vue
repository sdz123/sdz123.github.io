<template>
  <div class="player-bg">
    <div class="player-card">
      <!-- 顶部：状态（可点击） + 标题 -->
      <PlayerHeader
          :state-class="stateClass"
          :status-bar-text="statusBarText"
          :track-title-full="trackTitleFull"
          @open-drawer="openDrawer('lists')"
      />

      <!-- 中部：左=封面；右=进度条 + 控制 -->
      <div class="center">
        <div class="cover"><div class="disc"></div></div>

        <div class="right-col">
          <!-- 进度（现在放在 controls 上面） -->
          <ProgressBar
              :duration="duration"
              :current-time="currentTime"
              @seek="onSeek"
          />

          <!-- 控制区：左（模式图标）、中（上一/播停/下一）、右（当前歌单曲目） -->
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

    <!-- 底部 Drawer：支持 lists / tracks 两种初始视图 -->
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
const drawerInitialView = ref('lists'); // 'lists' | 'tracks'
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
  drawerInitialView.value = view;                  // 'lists' 或 'tracks'
  drawerInitialListIndex.value = curListIndex.value; // 用当前歌单
  drawerOpen.value = true;
}
</script>

<style scoped>
.player-bg{
  min-height:100vh;
  display:flex; align-items:center; justify-content:center;
  background:
      radial-gradient(1200px 600px at 20% 10%, #e0f2ff 0%, transparent 50%),
      radial-gradient(1200px 600px at 80% 90%, #fde2ff 0%, transparent 50%),
      linear-gradient(135deg, #f6f9fc, #eef2f7);
  padding:20px;
  overflow-x:hidden; /* 防横向滚动条 */
  box-sizing: border-box;
}
.player-card{
  width: min(720px, 92vw);            /* 稍窄一点 */
  border-radius:20px;
  padding:18px 18px 16px;
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,.7);
  box-shadow: 0 10px 30px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6);
}

/* 中部布局：右列包含 进度条 + 控件 */
.center{
  display:grid;
  grid-template-columns: 150px 1fr;   /* 略收紧 */
  gap:16px;
  margin-top:14px;
}
.right-col{
  display:flex;
  flex-direction:column;
  gap:10px;                           /* 进度 与 控件 的间距 */
}

@media (max-width:560px){
  .player-card{ width: min(460px, 94vw); padding:14px; border-radius:16px; }
  .center{ grid-template-columns: 1fr; gap:12px; }
}

/* 封面 */
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

<!-- 全局：移除横向滚动条的兜底 -->
<style>
html, body { margin:0; overflow-x:hidden; }
</style>
