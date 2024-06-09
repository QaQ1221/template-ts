import './index.css';
import { Watch } from './example-unit';
import { Time } from './example-unit';

// refresh time
function updateDisplay(time: Time) {
    const timeDisplayElement = document.getElementById('time-display');
    if (timeDisplayElement) {
        timeDisplayElement.textContent = `${time.getTime()}`;
    }
}

//get and show GMT+1
const time = new Time();
time.updateToCurrentTime();
updateDisplay(time);

// change time every single seconds
setInterval(() => {
    time.updateToCurrentTime();
    updateDisplay(time);
}, 1000);


// Watch 
const myWatch = new Watch();
myWatch.displayTime();

document.getElementById('mode-button')?.addEventListener('click', () => {
    myWatch.modeButton();
});

document.getElementById('increase-button')?.addEventListener('click', () => {
    myWatch.increaseButton();
});

document.getElementById('light-button')?.addEventListener('click', () => {
    myWatch.lightButton();
});
