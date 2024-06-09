import './index.css';
import { ClockManager } from './example-unit';

const clockManager = new ClockManager('clock-container');

document.getElementById('add-clock-button')?.addEventListener('click', () => {
    const timezoneOffset = parseInt(prompt('Enter timezone offset (e.g., 1 for GMT+1):') || '0', 10);
    clockManager.addClock(timezoneOffset);
});