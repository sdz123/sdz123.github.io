// src/composables/useAudioPlayer.js
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { random } from "@/util.js";
import rawPlaylists from "@/playLists.js"; // 注意：按你项目里的文件名 playLists.js

export function useAudioPlayer() {
    // 兜底清洗 playlists，避免 undefined 结构导致渲染错误
    const fallbackPlaylists = [
        { id: "default", name: "全部歌曲", cover: "", tracks: [] }
    ];
    const safePlaylists = computed(() => {
        return Array.isArray(rawPlaylists) && rawPlaylists.length
            ? rawPlaylists.filter(Boolean).map(pl => ({
                id: pl?.id ?? "",
                name: pl?.name ?? "未命名歌单",
                cover: pl?.cover ?? "",
                tracks: Array.isArray(pl?.tracks) ? pl.tracks.filter(Boolean) : []
            }))
            : fallbackPlaylists;
    });

    // 播放器状态
    const audio = new Audio();
    audio.preload = "metadata";

    const duration = ref(0);
    const currentTime = ref(0);
    const volume = ref(0.8);
    const playStates = ref(1); // 1 停止 2 暂停 3 播放
    const playMode   = ref(0); // 0 列表循环 1 随机 2 单曲

    // 当前歌单/曲目索引（含 localStorage 持久化）
    const curListIndex  = ref(Number(localStorage.getItem("curListIndex")  || 0) || 0);
    const curTrackIndex = ref(Number(localStorage.getItem("curTrackIndex") || 0) || 0);

    const currentPlaylist = computed(() => {
        const list = safePlaylists.value;
        const idx  = Math.min(Math.max(0, curListIndex.value), Math.max(0, list.length - 1));
        if (idx !== curListIndex.value) curListIndex.value = idx;
        return list[idx] || { tracks: [] };
    });

    const tracks = computed(() => Array.isArray(currentPlaylist.value.tracks) ? currentPlaylist.value.tracks : []);
    const curTrack = computed(() => {
        const total = tracks.value.length;
        if (!total) return null;
        const idx = Math.min(Math.max(0, curTrackIndex.value), total - 1);
        if (idx !== curTrackIndex.value) curTrackIndex.value = idx;
        return tracks.value[idx] || null;
    });

    const curPlaySrc = computed(() => curTrack.value?.url || "");
    const trackTitleFromUrl = (url) => {
        try {
            const name = decodeURIComponent(String(url || "").split("/").pop() || "未命名音频");
            return name.replace(/\.(mp3|wav|m4a|ogg|flac)$/i, "");
        } catch { return "未命名音频"; }
    };
    const trackTitleFull = computed(() => curTrack.value?.title?.trim?.() || trackTitleFromUrl(curPlaySrc.value));

    const stateLabel = computed(() => {
        const n = curTrackIndex.value + 1;
        const total = tracks.value.length || 0;
        return playStates.value === 3 ? `正在播放第 ${n}/${total} 首`
            : playStates.value === 2 ? `第 ${n}/${total} 首暂停中`
                : "无音乐播放";
    });
    const stateLabelShort = computed(() => {
        const n = tracks.value.length ? curTrackIndex.value + 1 : 0;
        const total = tracks.value.length || 0;
        return playStates.value === 3 ? `播 ${n}/${total}`
            : playStates.value === 2 ? `停 ${n}/${total}`
                : "无";
    });
    const stateClass = computed(() => ({
        playing: playStates.value === 3,
        paused : playStates.value === 2,
        stopped: playStates.value === 1
    }));
    const playBtnAria = computed(() => playStates.value === 3 ? "暂停" : "播放");

    // 生命周期
    onMounted(() => {
        audio.autoplay = true;
        audio.volume   = volume.value;

        audio.addEventListener("loadedmetadata", onMeta);
        audio.addEventListener("timeupdate", onTick);
        audio.addEventListener("ended", onEnded);

        if (curPlaySrc.value) audio.src = curPlaySrc.value;
    });

    onBeforeUnmount(() => {
        audio.removeEventListener("loadedmetadata", onMeta);
        audio.removeEventListener("timeupdate", onTick);
        audio.removeEventListener("ended", onEnded);
    });

    // 持久化
    watch(curListIndex, (v) => {
        localStorage.setItem("curListIndex", String(v));
        curTrackIndex.value = 0;
        localStorage.setItem("curTrackIndex", "0");
        if (playStates.value === 3) play();
    });
    watch(curTrackIndex, (v) => localStorage.setItem("curTrackIndex", String(v)));

    // 控制
    audio.stop = function () {
        audio.currentTime = 0;
        audio.pause();
        playStates.value = 1;
    };

    function resume() { audio.play(); playStates.value = 3; }
    function play() {
        if (!curPlaySrc.value) return;
        audio.stop();
        audio.src = curPlaySrc.value;
        audio.play();
        playStates.value = 3;
    }
    function pause() { audio.pause(); playStates.value = 2; }
    function changePlayState() {
        if (playStates.value === 3) pause();
        else if (playStates.value === 1) play();
        else resume();
    }

    function setMode(mode) { playMode.value = mode; }
    const getRandomInt = random();
    function changePlayMode() {
        playMode.value = playMode.value + 1 > 2 ? 0 : playMode.value + 1;
        if (playMode.value === 1 && playStates.value !== 3 && tracks.value.length) {
            curTrackIndex.value = getRandomInt(0, tracks.value.length - 1);
        }
    }

    function next() {
        const total = tracks.value.length;
        if (!total) return;
        if (playMode.value === 1) curTrackIndex.value = getRandomInt(0, total - 1);
        else curTrackIndex.value = (curTrackIndex.value + 1) % total;
        play();
    }
    function prev() {
        const total = tracks.value.length;
        if (!total) return;
        curTrackIndex.value = (curTrackIndex.value - 1 + total) % total;
        play();
    }
    function switchPlaylist(i) {
        if (!Number.isInteger(i)) return;
        const max = Math.max(0, safePlaylists.value.length - 1);
        const nextIdx = Math.min(Math.max(0, i), max);
        if (nextIdx === curListIndex.value) return;
        curListIndex.value = nextIdx;
    }
    function playByIndex(i) {
        if (i < 0 || i >= tracks.value.length) return;
        curTrackIndex.value = i;
        play();
        requestAnimationFrame(() => {
            const el = document.querySelectorAll(".track-item")[i];
            el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
    }

    function onEnded() {
        const total = tracks.value.length;
        if (!total) return;
        if (playMode.value === 0) curTrackIndex.value = (curTrackIndex.value + 1) % total;
        else if (playMode.value === 1) curTrackIndex.value = getRandomInt(0, total - 1);
        play();
    }
    function onMeta() { duration.value = audio.duration || 0; }
    function onTick() { currentTime.value = audio.currentTime || 0; }

    function onSeek(v) { audio.currentTime = Number(v || 0); }
    function onVolume() { audio.volume = volume.value; }

    return {
        // 数据
        safePlaylists,
        currentPlaylist, tracks, curTrack,
        curListIndex, curTrackIndex,

        audio, duration, currentTime, volume,
        playStates, playMode,

        curPlaySrc, trackTitleFull, trackTitleFromUrl,
        stateLabel, stateLabelShort, stateClass, playBtnAria,

        // 方法
        play, pause, resume, changePlayState, next, prev, setMode, changePlayMode,
        switchPlaylist, playByIndex, onSeek, onVolume
    };
}
