import {Canvas, toggleCamera } from './components/VideoCanvas/VideoCanvas';
import {initAudioAnalyser, initAudioVizualizer} from './components/AudioAnalyser/AudioAnalyser';
import './style.sass';

const cameraList: HTMLElement | null = document.querySelector('.camera__list');
const cameraBackBtn: HTMLElement | null = document.querySelector('.camera__btn');

const brightnessControll: HTMLElement | null = document.querySelector('.range-controll_brightness');
const contrastControll: HTMLElement | null = document.querySelector('.range-controll_contrast');
const volumeControll: HTMLElement | null = document.querySelector('.volume__controll');

(function (): void {
    for (let i = 0; i < Canvas.length; i++) {
        cameraList && cameraList.appendChild(Canvas[i]);
    }

    cameraBackBtn && cameraBackBtn.addEventListener('click', toggleCamera);
    contrastControll && contrastControll.addEventListener('input', function() {
        const canvas: HTMLCanvasElement | null = document.querySelector('.camera_open');
        const ctx: CanvasRenderingContext2D | null = canvas && canvas.getContext('2d');
        if (ctx) {
            ctx.filter = `${ctx.filter.trim().split(' ').shift()} contrast(${Number((this as HTMLInputElement).value) / 100})`;
        }
    });
    brightnessControll && brightnessControll.addEventListener('input', function() {
        const canvas: HTMLCanvasElement | null = document.querySelector('.camera_open');
        const ctx: CanvasRenderingContext2D | null = canvas && canvas.getContext('2d');
        if (ctx) {
            ctx.filter = `brightness(${Number((this as HTMLInputElement).value) / 100}) ${ctx.filter.trim().split(' ').pop()}`;
        }
    });
    volumeControll && volumeControll.addEventListener('click', function() {
        this.classList.toggle('volume__controll_inactive');
        const canvas: HTMLCanvasElement | null = document.querySelector('.camera_open');
        canvas && canvas.classList.toggle('camera_muted');
    });

    initAudioAnalyser();
    initAudioVizualizer();
})();
