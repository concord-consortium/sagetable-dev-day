const cv = require('opencv.js');

const video = document.getElementById('video');
const width = 300;
const height = 225;
const FPS = 30;
let stream;
let streaming = false;

let src;
let dst;
const cap = new cv.VideoCapture(video);

export default function capture() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(_stream => {
      stream = _stream;
      video.srcObject = stream;
      video.play();
      streaming = true;
      src = new cv.Mat(height, width, cv.CV_8UC4);
      dst = new cv.Mat(height, width, cv.CV_8UC1);
      setTimeout(processVideo, 0)
  })
  .catch(err => console.log(`An error occurred: ${err}`));

  function processVideo () {
    if (!streaming) {
        src.delete();
        dst.delete();
        return;
    }
    const begin = Date.now();
    cap.read(src)
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('canvasOutput', dst);
    const delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
}