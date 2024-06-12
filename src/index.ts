import './index.css';
import { ClockManager } from './example-unit';

const clockManager = new ClockManager('clock-container');

// 清除已有的时钟容器内容
document.getElementById('clock-container')!.innerHTML = '';

// 初始化时添加三个时钟，分别为1-3时区
clockManager.addClock(1);
clockManager.addClock(2);
