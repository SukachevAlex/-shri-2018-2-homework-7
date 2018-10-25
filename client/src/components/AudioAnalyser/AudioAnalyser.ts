import { Camera } from '../Camera/Camera';

const graph = document.querySelector('.volume-oscilloscope');
const volumeBar = document.querySelector('.volume-bar');
const fftConstant = 2048;
const smoothConstant = 0.5;
let audioCtx = null;
let analyser = null;
let gainNode = null;
let bufferLength = null;
let dataArray = null;
let canvas = null;
let canvasVolume = null;
let ctx = null;
let ctxVolume = null;
let sources = new Map();

export function initAudioVizualizer() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    graph.appendChild(canvas);

    canvasVolume = document.createElement('canvas');
    ctxVolume = canvasVolume.getContext('2d');
    canvasVolume.width = 50;
    canvasVolume.height = 200;
    volumeBar.appendChild(canvasVolume);
}

export function initAudioAnalyser() {

    if (!isAudioContextAvailable) {
        return;
    }

    if (!audioCtx) {
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = smoothConstant;
        analyser.fftSize = fftConstant;
        gainNode = audioCtx.createGain();

    } else {
        audioCtx.resume();
    }
}

function draw() {
    if (graph.classList.contains('volume-oscilloscope_visible')) {
        requestAnimationFrame(draw);

        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        drawVolumeBar();
    }
}

function isAudioContextAvailable() {
    return Boolean(window.AudioContext || window.webkitAudioContext);
}

export function connectStream(stream, num) {
    if (!sources.get(num)) {
        sources.set(num, audioCtx.createMediaElementSource(stream));
    }
    let source = sources.get(num);
    source.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    draw();
}

function drawVolumeBar() {
    ctxVolume.clearRect(0, 0, canvasVolume.width, canvasVolume.height);
    ctxVolume.fillStyle = 'rgba(0, 0, 0, .15)';
    ctxVolume.fillRect(0, 0, canvasVolume.width, canvasVolume.height);

    ctxVolume.beginPath();
    ctxVolume.lineWidth = canvasVolume.width;
    ctxVolume.strokeStyle = "#fafafa";
    ctxVolume.moveTo(canvasVolume.width / 2, canvasVolume.height)

    let max = 0;
    dataArray.forEach(element => {
        if (element > max) {
            max = element;
        }
    });

    let normalizeValue = 128 / max;

    ctxVolume.lineTo(canvasVolume.width / 2, Math.round(canvasVolume.height * normalizeValue));
    ctxVolume.stroke();
}