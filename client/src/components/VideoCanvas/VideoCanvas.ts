import { Camera } from '../Camera/Camera';
import { connectStream } from '../AudioAnalyser/AudioAnalyser';

const Canvas: Array<HTMLCanvasElement> = [];
const controlls: HTMLElement = document.querySelector('.camera__controlls');
const volumeControll: HTMLElement = document.querySelector('.volume__controll');
const oscilloscope: HTMLElement = document.querySelector('.volume-oscilloscope');
const volumeBar: HTMLElement = document.querySelector('.volume-bar');

(function(): void {
    for (let i = 0; i < Camera.length; i++) {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        canvas.className = `camera camera-${i+1} camera_muted`;
        canvas.width = 640;
        canvas.height = 480;
        ctx.filter = `
            brightness(1)
            contrast(1)
        `;

        canvas.addEventListener('click', function(): void {
            canvas.classList.toggle('camera_open');
            controlls.classList.toggle('camera__controlls_visible');
            canvas.classList.add('camera_muted');
            volumeControll.classList.add('volume__controll_inactive');
            oscilloscope.classList.toggle('volume-oscilloscope_visible');
            volumeBar.classList.toggle('volume-bar_visible');

            if (this.classList.contains('camera_open')) {
                let num: number = parseInt(this.className.replace(/\D/g, ''));
                connectStream(Camera[--num], num);
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

function toggleCamera(): void {
    const camera: HTMLElement = document.querySelector('.camera_open');
    camera.classList.add('camera_muted');
    camera.classList.remove('camera_open');
    controlls.classList.remove('camera__controlls_visible');
    volumeBar.classList.remove('volume-bar_visible');
}

function changeContrast(): void {
    const canvas: HTMLCanvasElement = document.querySelector('.camera_open');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.filter = `${ctx.filter.trim().split(' ').shift()} contrast(${this.value / 100})`;
}

function changeBrightness(): void {
    const canvas: HTMLCanvasElement = document.querySelector('.camera_open');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.filter = `brightness(${this.value / 100}) ${ctx.filter.trim().split(' ').pop()}`;
}

function changeVolume(): void {
    this.classList.toggle('volume__controll_inactive');
    const canvas: HTMLCanvasElement = document.querySelector('.camera_open');
    canvas.classList.toggle('camera_muted');
}

export { Canvas, toggleCamera, changeContrast, changeBrightness, changeVolume };