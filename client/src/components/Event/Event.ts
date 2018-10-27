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
    
    const t: HTMLTemplateElement = document.querySelector('.template');
    const template: DocumentFragment = document.importNode(t.content, true);

    const eventList: HTMLElement | null = document.querySelector('.event__list');
    const eventItem: HTMLElement = template.querySelector('.event__item');
    const eventIcon: HTMLElement = template.querySelector('.event__icon');
    const eventTitle: HTMLElement = template.querySelector('.event__title');
    const eventSource : HTMLElement = template.querySelector('.event__source');
    const eventTime: HTMLElement = template.querySelector('.event__time');
    const eventDescription: HTMLElement = template.querySelector('.event__description');
    const eventData: HTMLElement = template.querySelector('.event__data');

    let {type, title, source, time, description, icon, size, data} = events;

    eventItem.className = `event__item event__item_${type} ${eventSizes[size]}`;
    eventIcon.className = `event__icon event__icon_${icon}`;
    eventTitle.textContent = title;
    eventSource.textContent = source;
    eventTime.textContent = time;
    size !== 's' ? eventTime.className = 'event__time event__time_float_right' : '';
    if (description) {
        eventDescription.textContent = description;

    } else {
        template.querySelector('.event__bottom-line').remove();
    }

    if (size === 'l') {
        eventDescription.className = 'event__description event__description_big';
    }

    if (type === 'critical') {
        template.querySelector('.event__info').className = 'event__info event__info_white';
    }

    if (data) {
        generateData(template, icon, data);
    } else {
        eventData.remove();
    }

    eventList && eventList.appendChild(template);
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

    const eventGraph: HTMLElement = template.querySelector('.event__graph');
    const eventThermal: HTMLElement = template.querySelector('.event__thermal');
    const eventPlayer:  HTMLElement = template.querySelector('.event__player');
    const eventButtons: HTMLElement = template.querySelector('.event__buttons');
    const eventImage: HTMLElement = template.querySelector('.event__image');
    const imageInfo: HTMLElement = template.querySelector('.image__info');

    if (icon === 'stats') {
        // create graph chart.js
    } else {
        eventGraph.remove();
    }

    if (icon === 'thermal') {
        eventThermal.querySelector('.temperature__value').textContent = `${data.temperature} C`;
        eventThermal.querySelector('.humidity__value').textContent = `${data.humidity}%`;
    } else {
        eventThermal.remove();
    }

    if (icon === 'music') {
        eventPlayer.querySelector<HTMLImageElement>('.player__albumcover').src = data.albumcover;
        eventPlayer.querySelector('.player__artist-name').textContent = data.artist;
        eventPlayer.querySelector('.player__track-name').textContent = data.track.name;
        eventPlayer.querySelector('.player__time').textContent = data.track.length;
        eventPlayer.querySelector<HTMLInputElement>('.player__timeline').max = data.track.length;
        eventPlayer.querySelector('.player__volume-value').textContent = `${data.volume}%`;
    } else {
        eventPlayer.remove();
    }

    if (icon === 'fridge') {
        if (data.buttons) {
            let html = '';
            for (let i = 0; i < data.buttons.length; i++) {
                html += `
                    <button class="btn event__btn">${data.buttons[i]}</button>
                `;
            }
            eventButtons.innerHTML = html;
        }
    } else {
        eventButtons.remove();
    }

    if (icon === 'cam') {

        eventImage.style.backgroundImage = `url(./img/${data.image})`;
        eventImage.style.backgroundPosition = '0 0';
        eventImage.style.backgroundSize = '178%';
        eventImage.style.filter = 'brightness(50%)';
        eventImage.addEventListener('pointerdown', mouseDown.bind(null, eventImage));
        eventImage.addEventListener('pointermove', mouseMove.bind(null, imageInfo));
        eventImage.addEventListener('pointerup', mouseUp);
        eventImage.addEventListener('pointercancel', mouseUp);

    } else {
        imageInfo.remove();
        eventImage.remove();
    }
}
