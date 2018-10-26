import './style.sass';
import { generateEvents, CustomEvents } from './components/Event/Event';

(function() {

    fetch('https://shri-homework-4.herokuapp.com/api/events?limit=11')
        .then(res => {
            return res.json();
        })
        .then((data) => {
            initEvents(data);
        })
        .catch(err => console.log(err));

})();

function supportsTemplate(): Boolean {
    return 'content' in document.createElement('template');
}

function initEvents(data: Array<CustomEvents>): void {
    if (supportsTemplate) {
        for (let key in data) {
            generateEvents(data[key]);
        }
    } else {
        console.log('error');
    }
}