const cv = require('opencv.js');

const video = document.getElementById('video');
const width = 300;
const height = 225;
const FPS = 30;
let stream;

let srcMat = new cv.Mat(height, width, cv.CV_8UC4);
let grayMat = new cv.Mat(height, width, cv.CV_8UC1);
let circlesMat = new cv.Mat();

const cap = new cv.VideoCapture(video);

export default function capture() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(_stream => {
      stream = _stream;
      video.srcObject = stream;
      video.play();
      setTimeout(processVideo, 0)
  })
  .catch(err => console.log(`An error occurred: ${err}`));

  function processVideo () {
    const begin = Date.now();

    cap.read(srcMat);

    cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);

    let displayMat = new cv.Mat(height, width, cv.CV_8UC4, cv.Scalar.all(0));
    
    cv.HoughCircles(grayMat, circlesMat, cv.HOUGH_GRADIENT, 1, 45, 75, 40, 0, 0);

    for (let i = 0; i < circlesMat.cols; ++i) {
        let x = circlesMat.data32F[i * 3];
        let y = circlesMat.data32F[i * 3 + 1];
        let radius = circlesMat.data32F[i * 3 + 2];

        let center = new cv.Point(x, y);
        cv.circle(displayMat, center, radius, [255, 0, 0, 255], 3);
    }

    cv.imshow('canvasOutput', displayMat);


    const delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
}