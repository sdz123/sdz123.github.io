<template>
  <div class="player-bg">
    <div class="player-card">
      <!-- 顶部：状态 + 标题 -->
      <PlayerHeader
          :state-class="stateClass"
          :state-label="stateLabel"
          :state-label-short="stateLabelShort"
          :track-title-full="trackTitleFull"
      />

      <!-- 歌单选择 -->
      <PlaylistChips
          :playlists="safePlaylists"
          :cur-list-index="curListIndex"
          @switch="(i)=>{ switchPlaylist(i); showList = true; }"
      />

      <!-- 歌单工具 -->
      <PlaylistTools
          :name="currentPlaylist?.name || '当前歌单'"
          :track-count="tracks.length"
          :show-list="showList"
          @toggle="showList = !showList"
      />

      <!-- 歌曲列表 -->
      <TrackList
          :show="showList"
          :name="currentPlaylist?.name || ''"
          :tracks="tracks"
          :cur-index="curTrackIndex"
          :play-states="playStates"
          @pick="playByIndex"
      />

      <!-- 中部封面 + 控制 -->
      <div class="center">
        <div class="cover">
          <div class="disc"></div>
        </div>
        <PlayerControls
            :play-states="playStates"
            :play-btn-aria="playBtnAria"
            @prev="prev"
            @toggle="changePlayState"
            @next="next"
        />
      </div>

      <!-- 进度 -->
      <ProgressBar
          :duration="duration"
          :current-time="currentTime"
          @seek="onSeek"
      />

      <!-- 底部：模式/音量/操作 -->
      <BottomBar
          :play-mode="playMode"
          :volume="volume"
          @mode="setMode"
          @volume="(v)=>{ volume = Number(v); onVolume(); }"
          @replay="play"
          @stop="audio.stop"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAudioPlayer } from "@/composables/useAudioPlayer.js";

import PlayerHeader     from "@/components/player/PlayerHeader.vue";
import PlaylistChips    from "@/components/player/PlaylistChips.vue";
import PlaylistTools    from "@/components/player/PlaylistTools.vue";
import TrackList        from "@/components/player/TrackList.vue";
import PlayerControls   from "@/components/player/PlayerControls.vue";
import ProgressBar      from "@/components/player/ProgressBar.vue";
import BottomBar        from "@/components/player/BottomBar.vue";

const showList = ref(false);

const {
  safePlaylists,
  currentPlaylist, tracks, curTrack,
  curListIndex, curTrackIndex,

  audio, duration, currentTime, volume,
  playStates, playMode,

  curPlaySrc, trackTitleFull,
  stateLabel, stateLabelShort, stateClass, playBtnAria,

  play, pause, resume, changePlayState, next, prev, setMode, changePlayMode,
  switchPlaylist, playByIndex, onSeek, onVolume
} = useAudioPlayer();
</script>

<style scoped>
.player-bg{
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:
      radial-gradient(1200px 600px at 20% 10%, #e0f2ff 0%, transparent 50%),
      radial-gradient(1200px 600px at 80% 90%, #fde2ff 0%, transparent 50%),
      linear-gradient(135deg, #f6f9fc, #eef2f7);
  padding:24px;
}
.player-card{
  width: min(720px, 94vw);
  border-radius:24px; padding:22px 22px 18px;
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,.7);
  box-shadow: 0 10px 30px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6);
}

/* 中部封面 */
.center{
  display:grid; grid-template-columns: 160px 1fr; gap:20px; margin-top:16px;
}
@media (max-width:560px){ .center{ grid-template-columns:1fr; } }
.cover{
  display:flex; align-items:center; justify-content:center;
  aspect-ratio:1/1; border-radius:20px;
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
