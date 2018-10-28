import {
    Canvas,
    toggleCamera,
    changeContrast,
    changeBrightness,
    changeVolume
} from './components/VideoCanvas/VideoCanvas';
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
    contrastControll && contrastControll.addEventListener('input', changeContrast);
    brightnessControll && brightnessControll.addEventListener('input', changeBrightness);
    volumeControll && volumeControll.addEventListener('click', changeVolume);

    initAudioAnalyser();
    initAudioVizualizer();
})();
