import { Camera } from '../Camera/Camera';

const graph: HTMLElement | null = document.querySelector('.volume-oscilloscope');
const volumeBar: HTMLElement | null = document.querySelector('.volume-bar');
const fftConstant: number = 2048;
const smoothConstant: number = 0.5;
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let gainNode: AudioNode | null = null;
let bufferLength: number | null = null;
let dataArray: Uint8Array | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let canvasVolume: HTMLCanvasElement | null = null;
let ctxVolume: CanvasRenderingContext2D | null = null;
let sources = new Map();

export function initAudioVizualizer(): void {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    graph && graph.appendChild(canvas);

    canvasVolume = document.createElement('canvas');
    ctxVolume = canvasVolume.getContext('2d');
    canvasVolume.width = 50;
    canvasVolume.height = 200;
    volumeBar && volumeBar.appendChild(canvasVolume);
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
    if (graph && graph.classList.contains('volume-oscilloscope_visible')) {
        requestAnimationFrame(draw);

        bufferLength = analyser && analyser.frequencyBinCount;
        if (analyser && bufferLength) {
            dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
        }
        

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
    if (!sources.get(num) && audioCtx) {
        sources.set(num, audioCtx.createMediaElementSource(stream));
    }
    let source = sources.get(num);
    source.connect(analyser);
    if (gainNode && analyser && audioCtx) {
        analyser.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    }
    
    draw();
}

function drawVolumeBar(): void {

    if (ctxVolume && canvasVolume) {
        ctxVolume.clearRect(0, 0, canvasVolume.width, canvasVolume.height);
        ctxVolume.fillStyle = 'rgba(0, 0, 0, .15)';
        ctxVolume.fillRect(0, 0, canvasVolume.width, canvasVolume.height);
        ctxVolume.beginPath();
        ctxVolume.lineWidth = canvasVolume.width;
        ctxVolume.strokeStyle = "#fafafa";
        ctxVolume.moveTo(canvasVolume.width / 2, canvasVolume.height)
    }

    let max: number = 0;
    dataArray && dataArray.forEach(element => {
        if (element > max) {
            max = element;
        }
    });

    let normalizeValue: number = 128 / max;

    if(ctxVolume && canvasVolume) {
        ctxVolume.lineTo(canvasVolume.width / 2, Math.round(canvasVolume.height * normalizeValue));
        ctxVolume.stroke();
    }
}