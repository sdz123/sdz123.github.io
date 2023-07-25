<template>
  <div class="wrap">
    <div>
      {{
        playStates === 3
          ? `正在播放第${curPlay + 1}首`
          : playStates === 2
          ? `第${curPlay + 1}首暂停中`
          : "无音乐播放"
      }}
    </div>
    <br />
    <button @click="changePlayState">
      {{ playStates === 1 ? "播放" : playStates === 2 ? "播放" : "暂停" }}
    </button>
    <br />
    <button @click="next">下一首</button>
    <br />
    <button @click="prev">上一首</button>
    <br />
    <button @click="changePlayMode">
      {{
        playMode === 0 ? "列表循环" : playMode === 1 ? "随机播放" : "单曲循环"
      }}
    </button>
    <br />
    <button @click="play">再听一遍</button>
    <br />
    <button @click="audio.stop">停止播放</button>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: auto;
  margin-top: 80px;
}
button {
  width: 100px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<script setup>
import { ref, computed } from "vue";
import { music } from "./constants/music";

function getRandomInt(min, max) {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  const value = Math.floor(Math.random() * (_max - _min + 1)) + _min; // 含最大值和最小值
  if (randomValue.includes(value)) {
    return getRandomInt(min, max);
  } else {
    randomValue.push(value);
    if (randomValue.length > 5) {
      randomValue.shift();
    }
    return value;
  }
}

let curPlay = ref(0);
let curPlaySrc = computed(() => music[curPlay.value]);
let playStates = ref(1); // 1 停止 2 暂停 3 播放
let playMode = ref(0); // 0 列表循环 1 随机播放 2 单曲循环
const randomValue = []; // 防止随机播放老是随机到之前的音乐;
const audio = new Audio();
audio.autoplay = true;
audio.stop = function () {
  audio.currentTime = 0;
  audio.pause();
  playStates.value = 1;
};
function resume() {
  audio.play();
  playStates.value = 3;
}
function play() {
  audio.stop();
  audio.src = curPlaySrc.value;
  audio.play();
  playStates.value = 3;
}
function pause() {
  audio.pause();
  playStates.value = 2;
}
function changePlayState() {
  if (playStates.value === 3) {
    pause();
  } else if (playStates.value === 1) {
    play();
  } else {
    resume();
  }
}

function changePlayMode() {
  playMode.value = playMode.value + 1 > 2 ? 0 : playMode.value + 1;
  if (playMode.value === 1 && playStates.value !== 3) {
    curPlay.value = getRandomInt(0, music.length - 1);
  }
}

function next() {
  if (playMode.value === 1) {
    curPlay.value = getRandomInt(0, music.length - 1);
  } else {
    curPlay.value = curPlay.value + 1 === music.length ? 0 : curPlay.value + 1;
  }
  play();
}

function prev() {
  curPlay.value =
    curPlay.value - 1 === -1 ? music.length - 1 : curPlay.value - 1;
  play();
}

audio.addEventListener("ended", function () {
  if (playMode.value === 0) {
    curPlay.value = curPlay.value + 1 === music.length ? 0 : curPlay.value + 1;
  } else if (playMode.value === 1) {
    curPlay.value = getRandomInt(0, music.length - 1);
  }
  play();
});
</script>
