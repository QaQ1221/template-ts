// index.ts
import './index.css';
import { Watch } from './example-unit';
import { Time } from './example-unit';

// 更新网页上的时间显示
function updateDisplay(time: Time) {
    const timeDisplayElement = document.getElementById('time-display');
    if (timeDisplayElement) {
        timeDisplayElement.textContent = `${time.getTime()}`;
    }
}

// 获取并显示GMT+1的实时时间
const time = new Time();
time.updateToCurrentTime();
updateDisplay(time);

// 每秒更新一次时间显示
setInterval(() => {
    time.updateToCurrentTime();
    updateDisplay(time);
}, 1000);


// 示例使用 Watch 类
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
// 模拟按钮按下的操作
console.log("Press Mode Button:");
myWatch.modeButton();
console.log("Press Increase Button:");
myWatch.increaseButton();

console.log("Press Mode Button:");
myWatch.modeButton();
console.log("Press Increase Button:");
myWatch.increaseButton();

console.log("Press Mode Button:");
myWatch.modeButton();

console.log("Press Light Button:");
myWatch.lightButton();

console.log("Press Reset Button:");
myWatch.resetButton();
