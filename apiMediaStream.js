const buttons = document.querySelectorAll(".button");
const startAudioButton = document.querySelector("#startAudio").addEventListener("click", recordAudio);
const startScreenButton = document.querySelector("#startScreen").addEventListener("click", recordSCreen);
const stopButton = document.querySelector("#stopAudio").addEventListener("click", stopRecording);;
const audioList = document.querySelector("#audio-list");
const videoList = document.querySelector("#video-list");

let mediaRecorder = null;
let chunks = [];

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support recording!");
  }

function recordAudio() {
    console.log("record audio started");

    navigator.mediaDevices
    .getUserMedia({ 
        audio: true
    })
    .then((stream) => {
        stopButton.disabled = false;
        startAudioButton.disabled = true;
        startScreenButton.disabled = true;

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
            console.log("record audio", e.data);
            chuncks.push(e.data);
        };

        mediaRecorder.onstop = (e) => {
            createMediaELement("audio", "audio/mp3", audioList);
            console.log("record screen stopped");
        };
        mediaRecorder.onerror = (e) => {};
        mediaRecorder.start(1000);
    })
    .catch((err) => {
        alert(`The following error occurred: ${err}`);
      });
};

function  stopRecording() {
    stopButton.disabled = true;
    startAudioButton.disabled = false;
    startScreenButton.disabled = false;
    mediaRecorder.stop();
};

function createMediaELement(mediaType, fileType, placeToAdd) {
    const blob = new Blob(chunks, {
        type: fileType,
    });

    const mediaURL = window.URL.createObjectURL(blob);
    console.log("mediaUrl", mediaURL);
    const mediaURL = window.URL.createObjectURL(blob);
  const element = document.createElement(mediaType);
  element.setAttribute("controls", "");
  element.src = mediaURL;
  placeToAdd.insertBefore(element, placeToAdd.firstElementChild);
  mediaRecorder = null;
  chunks = [];  

  stopButton.disabled = true;
  startAudioButton.disabled = false;
  startScreenButton.disabled = false;
}

function recordSCreen() {
    navigator.mediaDevices
      .getDisplayMedia({ mediaSource: "screen"})
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = (e) => {
          createMediaElement("video", chunks[0].type, videoList);
        };
        mediaRecorder.start();
      })
  }