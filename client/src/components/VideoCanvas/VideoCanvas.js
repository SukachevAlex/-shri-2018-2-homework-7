import { Camera } from '../Camera/Camera';
import { connectStream } from '../AudioAnalyser/AudioAnalyser';

const Canvas = [];
const controlls = document.querySelector('.camera__controlls');
const volumeControll = document.querySelector('.volume__controll');
const oscilloscope = document.querySelector('.volume-oscilloscope');
const volumeBar = document.querySelector('.volume-bar');

(function() {
    for (let i = 0; i < Camera.length; i++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.className = `camera camera-${i+1} camera_muted`;
        canvas.width = 640;
        canvas.height = 480;
        ctx.filter = `
            brightness(1)
            contrast(1)
        `;

        canvas.addEventListener('click', function() {
            canvas.classList.toggle('camera_open');
            controlls.classList.toggle('camera__controlls_visible');
            canvas.classList.add('camera_muted');
            volumeControll.classList.add('volume__controll_inactive');
            oscilloscope.classList.toggle('volume-oscilloscope_visible');
            volumeBar.classList.toggle('volume-bar_visible');

            if (this.classList.contains('camera_open')) {
                let num = this.className.replace(/\D/g, '');
                connectStream(Camera[num - 1], num);
            }
        });

        const animate = () => {
            ctx.drawImage(Camera[i], 0, 0, canvas.width, canvas.height);
            window.requestAnimationFrame(animate);

            canvas.classList.contains('camera_muted') ? Camera[i].muted = true : Camera[i].muted = false;
        };
        animate();

        Canvas.push(canvas);
    }

})();

function toggleCamera() {
    const camera = document.querySelector('.camera_open');
    camera.classList.add('camera_muted');
    camera.classList.remove('camera_open');
    controlls.classList.remove('camera__controlls_visible');
}

function changeContrast() {
    const canvas = document.querySelector('.camera_open');
    const ctx = canvas.getContext('2d');
    ctx.filter = `${ctx.filter.trim().split(' ').shift()} contrast(${this.value / 100})`;
}

function changeBrightness() {
    const canvas = document.querySelector('.camera_open');
    const ctx = canvas.getContext('2d');
    ctx.filter = `brightness(${this.value / 100}) ${ctx.filter.trim().split(' ').pop()}`;
}

function changeVolume() {
    this.classList.toggle('volume__controll_inactive');
    const canvas = document.querySelector('.camera_open');
    canvas.classList.toggle('camera_muted');
}

export { Canvas, toggleCamera, changeContrast, changeBrightness, changeVolume };