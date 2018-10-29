import './style.sass';
import { generateEvents, ICustomEvents } from './components/Event/Event';

((): void => {

    fetch('https://shri-homework-4.herokuapp.com/api/events?limit=11')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            initEvents(data);
        })
        .catch((err) => console.log(err));

})();

function supportsTemplate(): boolean {
    return 'content' in document.createElement('template');
}

function initEvents(data: ICustomEvents[]): void {
    if (supportsTemplate) {
        data.forEach((el) => generateEvents(el));
    } else {
        console.log('error');
    }
}
