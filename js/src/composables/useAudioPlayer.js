// src/composables/useAudioPlayer.js
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { random } from "@/util.js";
import rawPlaylists from "@/playLists.js";

export function useAudioPlayer() {
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

    onMounted(() => {
        audio.autoplay = true;
        audio.volume   = 1.0;

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

    watch(curListIndex, (v) => {
        localStorage.setItem("curListIndex", String(v));
        curTrackIndex.value = 0;
        localStorage.setItem("curTrackIndex", "0");
        if (playStates.value === 3) play();
    });
    watch(curTrackIndex, (v) => localStorage.setItem("curTrackIndex", String(v)));

    function resume() { audio.play(); playStates.value = 3; }
    function play() {
        if (!curPlaySrc.value) return;
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

    const getRandomInt = random();
    // ✅ 改动：切换模式时不再改变当前曲目或触发播放
    function changePlayMode() {
        playMode.value = playMode.value + 1 > 2 ? 0 : playMode.value + 1;
        // 不修改 curTrackIndex，不调用 play()
    }
    function setMode(mode) { playMode.value = mode; }

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
        const lists = safePlaylists.value;
        const max = Math.max(0, lists.length - 1);
        const nextIdx = Math.min(Math.max(0, i), max);
        const nextTracksLen = Array.isArray(lists[nextIdx]?.tracks) ? lists[nextIdx].tracks.length : 0;
        if (nextTracksLen <= 0) return;
        if (nextIdx === curListIndex.value) return;
        curListIndex.value = nextIdx;
    }

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

    return {
        safePlaylists, currentPlaylist, tracks, curTrack,
        curListIndex, curTrackIndex,
        audio, duration, currentTime,
        playStates, playMode,
        curPlaySrc, trackTitleFull, trackTitleFromUrl,
        statusBarText, stateClass, playBtnAria,

        play, pause, resume, changePlayState, next, prev, setMode, changePlayMode,
        switchPlaylist, playIn, onSeek
    };
}
