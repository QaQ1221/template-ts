import { Watch } from './watch';

export class ClockManager {
    private watches: Watch[] = [];
    private container: HTMLElement;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id ${containerId} not found`);
        }
        this.container = container;

        // 只在构造函数中绑定一次事件监听器
        document.getElementById('add-clock-button')?.addEventListener('click', () => {
            const clockCount = parseInt((document.getElementById('clock-count') as HTMLInputElement).value, 10);
            const timezoneOffset = parseInt((document.getElementById('timezone-offset') as HTMLInputElement).value, 10);
            this.addClocks(clockCount, timezoneOffset);
        });
    }

    addClocks(count: number, timezoneOffset: number): void {
        for (let i = 0; i < count; i++) {
            this.addClock(timezoneOffset + i); // 每个时钟的时区偏移递增
        }
    }

    addClock(timezoneOffset: number): void {
        const uniqueId = `time-display-${this.watches.length + 1}-${Date.now()}`; // 生成唯一ID
        const watch = new Watch(uniqueId, timezoneOffset); // 将唯一ID和时区偏移传递给Watch实例
        this.watches.push(watch);

        const clockElement = document.createElement('div');
        clockElement.className = 'clock';
        clockElement.id = uniqueId; // 设置唯一ID
        clockElement.innerHTML = `
            <div class="timezone">GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}</div>
            <div class="square">
                <h1>Loading...</h1>
                <div class="buttons left-buttons">
                    <button class="mode-button" data-id="${uniqueId}">Mode</button>
                    <button class="increase-button" data-id="${uniqueId}">Increase</button>
                    <button class="light-button" data-id="${uniqueId}">Light</button>
                </div>
                <div class="buttons right-buttons">
                    <button class="reset-button" data-id="${uniqueId}">Reset</button>
                    <button class="toggle-format-button" data-id="${uniqueId}">Toggle Format</button>
                </div>
            </div>
            <div class="clock-id">ID: ${uniqueId}</div> <!-- 显示唯一ID -->
        `;

        this.container.appendChild(clockElement);

        // 通过 data-id 属性绑定事件监听器
        document.querySelector(`.mode-button[data-id="${uniqueId}"]`)?.addEventListener('click', () => {
            watch.modeButton();
        });

        document.querySelector(`.increase-button[data-id="${uniqueId}"]`)?.addEventListener('click', () => {
            watch.increaseButton();
        });

        document.querySelector(`.light-button[data-id="${uniqueId}"]`)?.addEventListener('click', () => {
            watch.lightButton();
        });

        document.querySelector(`.reset-button[data-id="${uniqueId}"]`)?.addEventListener('click', () => {
            watch.resetButton();
        });

        document.querySelector(`.toggle-format-button[data-id="${uniqueId}"]`)?.addEventListener('click', () => {
            watch.toggleFormatButton();
        });

        setInterval(() => {
            const currentTime = watch.getCurrentTime();
            currentTime.increaseSecond();
            watch.displayTime();
        }, 1000);
    }
}
