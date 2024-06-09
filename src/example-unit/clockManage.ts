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
    }

    addClock(timezoneOffset: number): void {
        const watch = new Watch();
        this.watches.push(watch);

        const clockElement = document.createElement('div');
        clockElement.className = 'clock';
        clockElement.innerHTML = `
            <div class="timezone">GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}</div>
            <div class="square">
                <h1 id="time-display-${watch.getUniqueId()}">Loading...</h1>
                <div class="buttons">
                    <button class="mode-button">Mode</button>
                    <button class="increase-button">Increase</button>
                    <button class="reset-button">Reset</button>
                    <button class="toggle-format-button">Toggle Format</button>
                </div>
            </div>
        `;

        this.container.appendChild(clockElement);

        document.querySelector(`#time-display-${watch.getUniqueId()}`)?.addEventListener('click', () => {
            watch.displayTime();
        });

        document.querySelector(`#time-display-${watch.getUniqueId()} .mode-button`)?.addEventListener('click', () => {
            watch.modeButton();
        });

        document.querySelector(`#time-display-${watch.getUniqueId()} .increase-button`)?.addEventListener('click', () => {
            watch.increaseButton();
        });

        document.querySelector(`#time-display-${watch.getUniqueId()} .reset-button`)?.addEventListener('click', () => {
            watch.resetButton();
        });

        document.querySelector(`#time-display-${watch.getUniqueId()} .toggle-format-button`)?.addEventListener('click', () => {
            watch.toggleFormatButton();
        });

        setInterval(() => {
            const currentTime = watch.getCurrentTime();
            currentTime.increaseSecond();
            watch.displayTime();
        }, 1000);
    }
}
