let gesture = {
    startX: null,
    startY: null,
    startLength: null,
    startAngle: null,
    prevX: null,
    prevY: null
};

let events = [];

export function mouseDown(eventImage, e) {

    events.push(e);
    gesture = {
        startX: e.x,
        startY: e.y,
        startLength: 1,
        startAngle: 0,
        prevX: parseInt(e.target.style.backgroundPositionX),
        prevY: parseInt(e.target.style.backgroundPositionY),
    };

    if (events.length === 2) {
        let dx = events[1].clientX - events[0].clientX;
        let dy = events[1].clientY - events[0].clientY;

        gesture.startAngle = getAngle(dx, dy);
        gesture.startLength = getLength(dx, dy);
    }

    eventImage.setPointerCapture(e.pointerId);
}

export function mouseMove(imageInfo, e) {

    for (let i = 0; i < events.length; i++) {
        if (e.pointerId === events[i].pointerId) {
            events[i] = e;
        }
    }

    if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
        const zoomField = imageInfo.querySelector('.zoom__value');
        const brightnessField = imageInfo.querySelector('.brightness__value');
        const fluency = 20;
        const limit = 5;

        if (events.length === 1) {
            const dx = e.x - gesture.startX;
            // const dy = e.y - gesture.startY;

            e.target.style.backgroundPositionX = `${gesture.prevX + dx}px`;
            // e.target.style.backgroundPositionY = `${gesture.prevY + dy}px`;
        } else if (events.length === 2) {
            const dx = events[1].clientX - events[0].clientX;
            const dy = events[1].clientY - events[0].clientY;

            if (Math.abs(gesture.startAngle - getAngle(dx, dy)) <= limit) {
                let length = getLength(dx, dy) - gesture.startLength;
                let zoomPrev = parseInt(e.target.style.backgroundSize);
                let currZoom = Math.min(400, Math.max(100, parseInt(zoomPrev + length / fluency)));
                e.target.style.backgroundSize = `${currZoom}%`;
                zoomField.textContent = `${currZoom - 100}%`;
            } else {
                let angle = gesture.startAngle - getAngle(dx, dy);
                let brightPrev = parseInt(e.target.style.filter.match(/\d+/)[0]);
                let brightCurr = Math.min(100, Math.max(0, parseInt(brightPrev + angle / 20)));
                brightnessField.textContent = `${brightCurr}%`;
                e.target.style.filter = `brightness(${brightCurr}%)`;
            }
        }
    }
}

export function mouseUp(e) {
    events.pop();
}

function getLength(dx, dy) {
    return parseInt(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
}

function getAngle(dx, dy) {
    return parseInt(Math.atan2(dx, dy) * 180 / Math.PI);
}
