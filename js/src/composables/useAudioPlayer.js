// src/composables/useAudioPlayer.js
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { random } from "@/util.js";
import rawPlaylists from "@/playLists.js"; // 你的数据文件

export function useAudioPlayer() {
    // ——— 歌单兜底清洗 ———
    const fallbackPlaylists = [{ id: "default", name: "全部歌曲", cover: "", tracks: [] }];
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

    // ——— 播放器状态（已移除音量） ———
    const audio = new Audio();
    audio.preload = "metadata";

    const duration = ref(0);
    const currentTime = ref(0);
    const playStates = ref(1); // 1 停止 2 暂停 3 播放
    const playMode   = ref(0); // 0 列表循环 1 随机 2 单曲

    const curListIndex  = ref(Number(localStorage.getItem("curListIndex")  || 0) || 0);
    const curTrackIndex = ref(Number(localStorage.getItem("curTrackIndex") || 0) || 0);

    const currentPlaylist = computed(() => {
        const list = safePlaylists.value;
        const idx  = Math.min(Math.max(0, curListIndex.value), Math.max(0, list.length - 1));
        if (idx !== curListIndex.value) curListIndex.value = idx;
        return list[idx] || { tracks: [] };
    });
    const tracks = computed(() =>
        Array.isArray(currentPlaylist.value.tracks) ? currentPlaylist.value.tracks : []
    );
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

    // status 展示（歌单名 + 第N/M首）
    const statusBarText = computed(() => {
        const name  = currentPlaylist.value?.name || "歌单";
        const total = tracks.value.length || 0;
        const n     = total ? (curTrackIndex.value + 1) : 0;
        return `${name} · 第 ${n}/${total} 首`;
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
        audio.volume   = 1.0; // 固定音量（已无调节功能）

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

    // 控制（已移除外露的 stop；在 play 内部做重置）
    function resume() { audio.play(); playStates.value = 3; }
    function play() {
        if (!curPlaySrc.value) return;
        // 内部重置：替代原 audio.stop()
        try { audio.pause(); } catch {}
        audio.currentTime = 0;
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

    // 防止切换到空歌单
    function switchPlaylist(i) {
        if (!Number.isInteger(i)) return;
        const lists = safePlaylists.value;
        const max = Math.max(0, lists.length - 1);
        const nextIdx = Math.min(Math.max(0, i), max);
        const nextTracksLen = Array.isArray(lists[nextIdx]?.tracks) ? lists[nextIdx].tracks.length : 0;
        if (nextTracksLen <= 0) return; // 空歌单：不切换
        if (nextIdx === curListIndex.value) return;
        curListIndex.value = nextIdx;
    }

    // 指定歌单+曲目播放（也校验空歌单）
    function playIn(listIndex, trackIndex) {
        const lists = safePlaylists.value;
        const li = Math.min(Math.max(0, listIndex), Math.max(0, lists.length - 1));
        const tLen = Array.isArray(lists[li]?.tracks) ? lists[li].tracks.length : 0;
        if (tLen <= 0) return;
        const ti = Math.min(Math.max(0, trackIndex), Math.max(0, tLen - 1));
        curListIndex.value  = li;
        curTrackIndex.value = ti;
        play();
    }

    // 事件
    function onEnded() {
        const total = tracks.value.length;
        if (!total) return;
        if (playMode.value === 0) curTrackIndex.value = (curTrackIndex.value + 1) % total;
        else if (playMode.value === 1) curTrackIndex.value = getRandomInt(0, total - 1);
        play();
    }
    function onMeta() { duration.value = audio.duration || 0; }
    function onTick() { currentTime.value = audio.currentTime || 0; }

    // 进度（已移除 onVolume）
    function onSeek(v) { audio.currentTime = Number(v || 0); }

    return {
        // 数据
        safePlaylists, currentPlaylist, tracks, curTrack,
        curListIndex, curTrackIndex,
        audio, duration, currentTime,
        playStates, playMode,
        curPlaySrc, trackTitleFull, trackTitleFromUrl,
        statusBarText, stateClass, playBtnAria,

        // 方法
        play, pause, resume, changePlayState, next, prev, setMode, changePlayMode,
        switchPlaylist, playIn, onSeek
    };
}
