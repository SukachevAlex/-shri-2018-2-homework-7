import {mouseDown, mouseMove, mouseUp} from '../PointerEvents/PointerEvents';

interface EventSizes {
    [size: string]:  string
};

const eventSizes: EventSizes = {
    's': 'event__item_s',
    'm': 'event__item_m',
    'l': 'event__item_l'
};

export interface CustomEvents {
    type: string, 
    title: string, 
    source: string, 
    time : string, 
    description : string | null, 
    icon : string, 
    size : string, 
    data : Data
}

export function generateEvents(events: CustomEvents | null): void {
    const t: HTMLTemplateElement | null = document.querySelector('.template');
    const template: DocumentFragment | null = document.importNode(t!.content, true);

    const eventList: HTMLElement | null = document.querySelector('.event__list');
    const eventItem: HTMLElement | null = template.querySelector('.event__item');
    const eventIcon: HTMLElement | null = template.querySelector('.event__icon');
    const eventTitle: HTMLElement | null = template.querySelector('.event__title');
    const eventSource : HTMLElement | null = template.querySelector('.event__source');
    const eventTime: HTMLElement | null = template.querySelector('.event__time');
    const eventDescription: HTMLElement | null = template.querySelector('.event__description');
    const eventData: HTMLElement | null = template.querySelector('.event__data');

    if (events) {
        let {type, title, source, time, description, icon, size, data} = events;
        
        if (eventItem && eventIcon && eventIcon && eventTitle && eventSource && eventTime) {
            eventItem.className = `event__item event__item_${type} ${eventSizes[size]}`;
            eventIcon.className = `event__icon event__icon_${icon}`;
            eventTitle.textContent = title;
            eventSource.textContent = source;
            eventTime.textContent = time;
        }
        size !== 's' && eventTime ? eventTime.className = 'event__time event__time_float_right' : '';
        if (description && eventDescription) {
            eventDescription.textContent = description;
    
        } else {
            template && template.querySelector('.event__bottom-line')!.remove();
        }
    
        if (size === 'l' && eventDescription) {
            eventDescription.className = 'event__description event__description_big';
        }
    
        if (type === 'critical' && template) {
            template.querySelector('.event__info')!.className = 'event__info event__info_white';
        }
    
        if (data) {
            generateData(template, icon, data);
        } else {
            eventData && eventData.remove();
        }
    
        eventList && eventList.appendChild(template);
    }


}

interface Data {
    temperature: number,
    humidity: number,
    type: string,
    albumcover: string,
    artist: string,
    track: {name: string, length: string},
    volume: number,
    buttons: Array<string>,
    image: string
}

function generateData(template: DocumentFragment, icon: string, data: Data): void {

    const eventGraph: HTMLElement | null = template.querySelector('.event__graph');
    const eventThermal: HTMLElement | null = template.querySelector('.event__thermal');
    const eventPlayer:  HTMLElement | null = template.querySelector('.event__player');
    const eventButtons: HTMLElement | null = template.querySelector('.event__buttons');
    const eventImage: HTMLElement | null = template.querySelector('.event__image');
    const imageInfo: HTMLElement | null = template.querySelector('.image__info');

    if (icon === 'stats') {
        // create graph chart.js
    } else {
        eventGraph && eventGraph.remove();
    }

    if (icon === 'thermal' && eventThermal) {
        eventThermal.querySelector('.temperature__value')!.textContent = `${data.temperature} C`;
        eventThermal.querySelector('.humidity__value')!.textContent = `${data.humidity}%`;
    } else {
        eventThermal && eventThermal.remove();
    }

    if (icon === 'music' && eventPlayer) {
        eventPlayer.querySelector<HTMLImageElement>('.player__albumcover')!.src = data.albumcover;
        eventPlayer.querySelector('.player__artist-name')!.textContent = data.artist;
        eventPlayer.querySelector('.player__track-name')!.textContent = data.track.name;
        eventPlayer.querySelector('.player__time')!.textContent = data.track.length;
        eventPlayer.querySelector<HTMLInputElement>('.player__timeline')!.max = data.track.length;
        eventPlayer.querySelector('.player__volume-value')!.textContent = `${data.volume}%`;
    } else {
        eventPlayer && eventPlayer.remove();
    }

    if (icon === 'fridge') {
        if (data.buttons && eventButtons) {
            let html = '';
            for (let i = 0; i < data.buttons.length; i++) {
                html += `
                    <button class="btn event__btn">${data.buttons[i]}</button>
                `;
            }
            eventButtons.innerHTML = html;
        }
    } else {
        eventButtons && eventButtons.remove();
    }

    if (icon === 'cam' && eventImage) {

        eventImage.style.backgroundImage = `url(./img/${data.image})`;
        eventImage.style.backgroundPosition = '0 0';
        eventImage.style.backgroundSize = '178%';
        eventImage.style.filter = 'brightness(50%)';
        eventImage.addEventListener('pointerdown', mouseDown.bind(null, eventImage));
        eventImage.addEventListener('pointermove', mouseMove.bind(null, imageInfo));
        eventImage.addEventListener('pointerup', mouseUp);
        eventImage.addEventListener('pointercancel', mouseUp);

    } else {
        imageInfo && imageInfo.remove();
        eventImage && eventImage.remove();
    }
}
