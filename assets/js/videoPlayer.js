const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeButton");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, { method: "POST" });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.querySelector("i").classList.remove("fa-play");
    playBtn.querySelector("i").classList.add("fa-pause");
  } else {
    videoPlayer.pause();
    playBtn.querySelector("i").classList.remove("fa-pause");
    playBtn.querySelector("i").classList.add("fa-play");
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.querySelector("i").classList.remove("fa-volume-mute");
    if (videoPlayer.volume >= 0.6) {
      volumeBtn.querySelector("i").classList.add("fa-volume-up");
    } else if (videoPlayer.volume == 0) {
      volumeBtn.querySelector("i").classList.add("fa-volume-off");
    } else {
      volumeBtn.querySelector("i").classList.add("fa-volume-down");
    }

    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.querySelector("i").classList.remove("fa-volume-up");
    volumeBtn.querySelector("i").classList.remove("fa-volume-down");
    volumeBtn.querySelector("i").classList.remove("fa-volume-off");
    volumeBtn.querySelector("i").classList.add("fa-volume-mute");
  }
}

function exitFullScreen() {
  fullScrnBtn.querySelector("i").classList.remove("fa-compress");
  fullScrnBtn.querySelector("i").classList.add("fa-expand");
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.querySelector("i").classList.remove("fa-expand");
  fullScrnBtn.querySelector("i").classList.add("fa-compress");
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function setTotalTime() {
  const totalTimeString = formatDate(Math.floor(videoPlayer.duration));
  totalTime.innerHTML = totalTimeString;
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  videoPlayer.currentTime = 0;
  videoPlayer.pause();
  playBtn.querySelector("i").classList.remove("fa-pause");
  playBtn.querySelector("i").classList.add("fa-play");
}

function handleDrag(event) {
  const {
    target: { value }
  } = event;
  videoPlayer.volume = parseFloat(value);
  if (value >= 0.6) {
    volumeBtn.querySelector("i").classList.remove("fa-volume-mute");
    volumeBtn.querySelector("i").classList.remove("fa-volume-down");
    volumeBtn.querySelector("i").classList.remove("fa-volume-off");
    volumeBtn.querySelector("i").classList.add("fa-volume-up");
  } else if (value == 0) {
    volumeBtn.querySelector("i").classList.remove("fa-volume-mute");
    volumeBtn.querySelector("i").classList.remove("fa-volume-up");
    volumeBtn.querySelector("i").classList.remove("fa-volume-down");
    volumeBtn.querySelector("i").classList.add("fa-volume-off");
  } else {
    volumeBtn.querySelector("i").classList.remove("fa-volume-mute");
    volumeBtn.querySelector("i").classList.remove("fa-volume-up");
    volumeBtn.querySelector("i").classList.remove("fa-volume-off");
    volumeBtn.querySelector("i").classList.add("fa-volume-down");
  }
}

function init() {
  videoPlayer.volue = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScrnBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
  registerView();
}

if (videoContainer) {
  init();
}
