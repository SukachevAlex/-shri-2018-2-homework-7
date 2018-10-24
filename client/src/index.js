import './style.sass';
import { generateEvents } from './components/Event/Event';

(function() {
    // const data = require('./data/events.json');
    // let data1;

    fetch('https://shri-homework-4.herokuapp.com/api/events?limit=11')
        .then(res => {
            return res.json();
        })
        .then((data) => {
            initEvents(data);
        })
        .catch(err => console.log(err));

})();

function supportsTemplate() {
    return 'content' in document.createElement('template');
}

function initEvents(data) {
    if (supportsTemplate) {
        data.forEach(el => generateEvents(el));
    } else {
        console.log('error');
    }
}