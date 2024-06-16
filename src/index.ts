// example-unit/index.ts
import './index.css';
import { ClockManager } from './example-unit';

// 初始化 ClockManager
const clockManager = new ClockManager('clock-container');

// empty inner
document.getElementById('clock-container')!.innerHTML = '';

// Add clock
clockManager.addClock(1);
// clockManager.addClock(2);
