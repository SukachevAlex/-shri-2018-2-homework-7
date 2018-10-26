import { Camera } from '../Camera/Camera';

const graph: HTMLElement = document.querySelector('.volume-oscilloscope');
const volumeBar: HTMLElement = document.querySelector('.volume-bar');
const fftConstant: number = 2048;
const smoothConstant: number = 0.5;
let audioCtx: AudioContext = null;
let analyser: AnalyserNode = null;
let gainNode: AudioNode = null;
let bufferLength: number = null;
let dataArray: Uint8Array = null;
let canvas: HTMLCanvasElement = null;
let ctx: CanvasRenderingContext2D = null;
let canvasVolume: HTMLCanvasElement = null;
let ctxVolume: CanvasRenderingContext2D = null;
let sources = new Map();

export function initAudioVizualizer(): void {
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

export function initAudioAnalyser(): void {

    if (!getAudioContext(window)) {
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

function draw(): void {
    if (graph.classList.contains('volume-oscilloscope_visible')) {
        requestAnimationFrame(draw);

        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        drawVolumeBar();
    }
}

function getAudioContext(obj: any): obj is {
    AudioContext: AudioContext,
    webkitAudioContext: AudioContext,
} {
    return obj.AudioContext || obj.webkitAudioContext;
}


export function connectStream(stream: HTMLVideoElement, num: number): void {
    if (!sources.get(num)) {
        sources.set(num, audioCtx.createMediaElementSource(stream));
    }
    let source = sources.get(num);
    source.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    draw();
}

function drawVolumeBar(): void {
    ctxVolume.clearRect(0, 0, canvasVolume.width, canvasVolume.height);
    ctxVolume.fillStyle = 'rgba(0, 0, 0, .15)';
    ctxVolume.fillRect(0, 0, canvasVolume.width, canvasVolume.height);

    ctxVolume.beginPath();
    ctxVolume.lineWidth = canvasVolume.width;
    ctxVolume.strokeStyle = "#fafafa";
    ctxVolume.moveTo(canvasVolume.width / 2, canvasVolume.height)

    let max: number = 0;
    dataArray.forEach(element => {
        if (element > max) {
            max = element;
        }
    });

    let normalizeValue: number = 128 / max;

    ctxVolume.lineTo(canvasVolume.width / 2, Math.round(canvasVolume.height * normalizeValue));
    ctxVolume.stroke();
}