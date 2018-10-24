import {
    Canvas,
    toggleCamera,
    changeContrast,
    changeBrightness,
    changeVolume
} from './components/VideoCanvas/VideoCanvas';
import {initAudioAnalyser, initAudioVizualizer} from './components/AudioAnalyser/AudioAnalyser';
import './style.sass';

const cameraList = document.querySelector('.camera__list');
const cameraBackBtn = document.querySelector('.camera__btn');

const brightnessControll = document.querySelector('.range-controll_brightness');
const contrastControll = document.querySelector('.range-controll_contrast');
const volumeControll = document.querySelector('.volume__controll');

(function () {
    for (let i = 0; i < Canvas.length; i++) {
        cameraList.appendChild(Canvas[i]);
    }

    cameraBackBtn.addEventListener('click', toggleCamera);
    contrastControll.addEventListener('input', changeContrast);
    brightnessControll.addEventListener('input', changeBrightness);
    volumeControll.addEventListener('click', changeVolume);

    initAudioAnalyser();
    initAudioVizualizer();
})();
