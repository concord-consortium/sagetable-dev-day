const cv = require('opencv.js');
var AR = require('js-aruco').AR;

const video = document.getElementById('video');
const width = 1900;
const height = 1050;
const FPS = 30;
let stream;

let srcMat = new cv.Mat(height, width, cv.CV_8UC4);
let grayMat = new cv.Mat(height, width, cv.CV_8UC1);
let circlesMat = new cv.Mat();

const cap = new cv.VideoCapture(video);

var detector = new AR.Detector();

export default function capture(callback) {
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

    var canvas = document.getElementById("markersCanvas");
    var context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var markers = detector.detect(imageData);

    console.log({markers});
    const nodes = [];
    for(let i=0; i < markers.length; i++) {
      const m = markers[i];
      for(let j=0; j < m.corners.length; j++) {
        nodes.push({x: m.corners[j].x, y: m.corners[j].y} )
      }
    }
    console.log({nodes});

    callback(nodes);

    const delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }
}