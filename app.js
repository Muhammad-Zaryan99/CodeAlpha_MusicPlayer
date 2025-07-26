const pause = document.querySelector(".fa-pause");
const play = document.querySelector(".fa-play");
const title = document.querySelector(".title");
const image = document.querySelector(".artist");
const ad = document.querySelector(".song");
const singer = document.querySelector(".singer");
const playSong = document.querySelector("#play-song");
const progressBar = document.querySelector(".line");
const progress = document.querySelector(".linechild");
const startTime = document.querySelector("#start");
const endTime = document.querySelector("#end");

const singers = ['Alan Walker', 'Justin Bieber', 'Atif Aslam', 'Sia', 'Imagine Dragons'];
const playList = ['FADED', 'DESPACITO', 'O SAATHI', 'CHEAP THRILLS', 'BELIEVER'];

let x = 0;
let isForwarding = false;

playSong.addEventListener("click", effect);
progressBar.addEventListener("click", seek);

function effect() {
  if (ad.paused) {
    ad.play().catch(err => console.error("Play error:", err));
  } else {
    ad.pause();
  }
  updateIcons();
  title.classList.toggle('run');
  image.classList.toggle('round');
}

function updateIcons() {
  if (ad.paused) {
    play.classList.remove('none');
    pause.classList.add('none');
    console.log("Song paused, showing play icon");
  } else {
    play.classList.add('none');
    pause.classList.remove('none');
    console.log("Song playing, showing pause icon");
  }
}

function removeEffect() {
  ad.pause();
  ad.currentTime = 0;
  title.classList.remove('run');
  image.classList.remove('round');
  updateIcons();
}

function backward() {
  if (isForwarding) return;
  x = (x - 1 + singers.length) % singers.length;
  console.log("Backward to index:", x, "Song:", playList[x]);
  removeEffect();
  songs(x);
  ad.play().catch(err => console.error("Backward play error:", err));
  updateIcons();
}

function forward() {
  if (isForwarding) return;
  isForwarding = true;
  x = (x + 1) % singers.length;
  console.log("Forward to index:", x, "Song:", playList[x]);
  removeEffect();
  songs(x);
  ad.play().catch(err => console.error("Forward play error:", err));
  updateIcons();
  setTimeout(() => { isForwarding = false; }, 300);
}

function songs(x) {
  if (x >= 0 && x < singers.length) {
    singer.innerHTML = singers[x];
    title.innerHTML = playList[x];
    image.src = `p${x}.jpg`;
    ad.src = `s${x}.mp3`;
    console.log("Song loaded:", `s${x}.mp3`, "Image:", `p${x}.jpg`);
  } else {
    console.error("Invalid index:", x);
  }
}

function seek(e) {
  if (isNaN(ad.duration)) {
    console.error("Audio duration not available");
    return;
  }
  const rect = progressBar.getBoundingClientRect();
  const offsetX = e.offsetX || e.clientX - rect.left;
  const width = rect.width;
  const seekTime = (offsetX / width) * ad.duration;
  ad.currentTime = seekTime;
  console.log("Seek to:", seekTime);
}

function updateProgress() {
  const current = ad.currentTime;
  const duration = ad.duration;
  if (!isNaN(duration) && duration > 0) {
    startTime.innerHTML = formatTime(current);
    endTime.innerHTML = formatTime(duration);
    progress.style.width = `${(current / duration) * 100}%`;
  } else {
    console.error("Invalid duration:", duration);
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}


ad.onloadedmetadata = () => {
  endTime.innerHTML = formatTime(ad.duration);
  startTime.innerHTML = "0:00";
  console.log("Metadata loaded, duration:", ad.duration);
};
ad.ontimeupdate = () => {
  updateProgress();
  updateIcons();
};
ad.onended = () => {
  if (!isForwarding) forward();
};
ad.onerror = () => {
  console.error("Audio error for:", ad.src);
};


songs(x);
updateIcons();