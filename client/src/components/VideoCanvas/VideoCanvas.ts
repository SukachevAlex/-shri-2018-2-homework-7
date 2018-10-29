import { Camera } from '../Camera/Camera';
import { connectStream } from '../AudioAnalyser/AudioAnalyser';

const Canvas: HTMLCanvasElement[] = [];
const controlls: HTMLElement | null = document.querySelector('.camera__controlls');
const volumeControll: HTMLElement | null = document.querySelector('.volume__controll');
const oscilloscope: HTMLElement | null = document.querySelector('.volume-oscilloscope');
const volumeBar: HTMLElement | null = document.querySelector('.volume-bar');

(function(): void {
    for (let i = 0; i < Camera.length; i++) {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        canvas.className = `camera camera-${i+1} camera_muted`;
        canvas.width = 640;
        canvas.height = 480;
        if (ctx) {
            ctx.filter = `brightness(1) contrast(1)`;
        }

        canvas.addEventListener('click', function(): void {
            canvas.classList.toggle('camera_open');
            controlls && controlls.classList.toggle('camera__controlls_visible');
            canvas.classList.add('camera_muted');
            volumeControll && volumeControll.classList.add('volume__controll_inactive');
            oscilloscope && oscilloscope.classList.toggle('volume-oscilloscope_visible');
            volumeBar && volumeBar.classList.toggle('volume-bar_visible');

            if (this.classList.contains('camera_open')) {
                let num: number = parseInt(this.className.replace(/\D/g, ''), 10);
                connectStream(Camera[--num], num);
            }
        });

        const animate = () => {
            ctx && ctx.drawImage(Camera[i], 0, 0, canvas.width, canvas.height);
            window.requestAnimationFrame(animate);

            canvas.classList.contains('camera_muted') ? Camera[i].muted = true : Camera[i].muted = false;
        };
        animate();

        Canvas.push(canvas);
    }

})();

function toggleCamera(): void {
    const camera = document.querySelector('.camera_open');
    camera && camera.classList.add('camera_muted');
    camera && camera.classList.remove('camera_open');
    controlls && controlls.classList.remove('camera__controlls_visible');
    volumeBar && volumeBar.classList.remove('volume-bar_visible');
}   

export { Canvas, toggleCamera };
