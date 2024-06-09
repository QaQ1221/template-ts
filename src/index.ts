import './index.css';
import { Watch } from './example-unit';

function updateDisplay(watch: Watch) {
    const timeDisplayElement = document.getElementById('time-display');
    if (timeDisplayElement) {
        timeDisplayElement.textContent = `${watch.getCurrentTime().getTime()}`;
    }
}

// Watch
const myWatch = new Watch();
myWatch.displayTime();
updateDisplay(myWatch);

// update seconds
setInterval(() => {
    const currentTime = myWatch.getCurrentTime();
    currentTime.updateToCurrentTime(currentTime.getHours(),currentTime.getMinutes(), currentTime.getSeconds());
    updateDisplay(myWatch);
    currentTime.increaseSecond();
}, 1000);

document.getElementById('mode-button')?.addEventListener('click', () => {
    myWatch.modeButton();
});

document.getElementById('increase-button')?.addEventListener('click', () => {
    myWatch.increaseButton();
    updateDisplay(myWatch);
});

document.getElementById('light-button')?.addEventListener('click', () => {
    myWatch.lightButton();
});
