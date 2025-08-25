const songs = [
  { title: "Rlaxing-Piano", artist: "Artist Aarav Mehta", src: "/CodeAlpha_Task4_MusicPlayer/musics/relaxing-piano.mp3" },
  { title: "Alone", artist: "Artist Sophia Ray", src: "/CodeAlpha_Task4_MusicPlayer/musics/relaxing.mp3" },
  { title: "whip-afro-dancehell", artist: "Artist Liam Carter", src: "/CodeAlpha_Task4_MusicPlayer/musics/whip-afro-dancehall.mp3" }
];

let currentSong = 0;
let isPlaying = false;
let shuffle = false;
let repeatMode = 0; // 0 = off, 1 = all, 2 = one

// DOM Elements
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const autoplayToggle = document.getElementById("autoplay");
const modeStatus = document.getElementById("modeStatus");

// Load autoplay from storage
autoplayToggle.checked = localStorage.getItem("autoplay") === "true";

// Load a song
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;

  document.querySelectorAll("#playlist li").forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

// Play
function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸️";
}

// Pause
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶️";
}

// Prev
function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  playSong();
}

// Next
function nextSong() {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else {
    currentSong = (currentSong + 1) % songs.length;
  }
  loadSong(currentSong);
  playSong();
}

// Update progress
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Seek
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Volume
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// Play/Pause
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Prev/Next
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Handle song end
audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    playSong(); // repeat one
  } else if (repeatMode === 1) {
    nextSong(); // repeat all
  } else if (autoplayToggle.checked) {
    nextSong(); // autoplay
  } else {
    pauseSong();
  }
});

// Playlist UI
songs.forEach((song, i) => {
  const li = document.createElement("li");
  li.textContent = `${song.title} - ${song.artist}`;
  li.addEventListener("click", () => {
    currentSong = i;
    loadSong(currentSong);
    playSong();
  });
  playlist.appendChild(li);
});

// Format time
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Shuffle toggle
shuffleBtn.addEventListener("click", () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active-shuffle", shuffle);
  updateModeStatus();
});

// Repeat toggle
repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.classList.remove("active-repeat-all", "active-repeat-one");

  if (repeatMode === 0) {
    repeatBtn.textContent = "🔁";
  } else if (repeatMode === 1) {
    repeatBtn.textContent = "🔁";
    repeatBtn.classList.add("active-repeat-all");
  } else {
    repeatBtn.textContent = "🔂";
    repeatBtn.classList.add("active-repeat-one");
  }
  updateModeStatus();
});

// Autoplay toggle
autoplayToggle.addEventListener("change", () => {
  localStorage.setItem("autoplay", autoplayToggle.checked);
  updateModeStatus();
});

// Update status line
function updateModeStatus() {
  if (repeatMode === 2) {
    modeStatus.innerHTML = `Mode: <span class="mode-repeat-one">Repeat-One 🔂</span>`;
  } else if (repeatMode === 1) {
    modeStatus.innerHTML = `Mode: <span class="mode-repeat-all">Repeat-All 🔁</span>`;
  } else if (shuffle) {
    modeStatus.innerHTML = `Mode: <span class="mode-shuffle">Shuffle 🔀</span>`;
  } else if (autoplayToggle.checked) {
    modeStatus.innerHTML = `Mode: <span class="mode-autoplay">Autoplay ▶️</span>`;
  } else {
    modeStatus.innerHTML = `Mode: <span class="mode-normal">Normal</span>`;
  }
}

// Initial load
loadSong(currentSong);
updateModeStatus();
