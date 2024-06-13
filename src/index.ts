import './index.css';
import { ClockManager } from './example-unit';

const clockManager = new ClockManager('clock-container');

// empty inner
document.getElementById('clock-container')!.innerHTML = '';

// Add clock
clockManager.addClock(1);