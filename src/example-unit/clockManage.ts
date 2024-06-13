import { Watch } from './watch';

export class ClockManager {
    private watches: Watch[] = [];
    private container: HTMLElement;
    private dialogContainer: HTMLElement;
    private step1: HTMLElement;
    private step2: HTMLElement;
    private nextButton: HTMLElement;
    private submitButton: HTMLElement;
    private cancelButton: HTMLElement;
    private addClockButton: HTMLElement;
    private isHandlingNextStep: boolean;
    private hasHandledNextStep: boolean;
    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        const dialogContainer = document.getElementById('dialog-container');
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        const nextButton = document.getElementById('next-button');
        const submitButton = document.getElementById('submit-button');
        const addClockButton = document.getElementById('add-clock-button');
        const cancelButton = document.getElementById('cancel-button');
        if (!container || !dialogContainer || !step1 || !step2 || !nextButton || !submitButton || !cancelButton|| !addClockButton) {
            throw new Error('Required element not found');
        }
        this.container = container;
        this.dialogContainer = dialogContainer;
        this.step1 = step1;
        this.step2 = step2;
        this.nextButton = nextButton;
        this.submitButton = submitButton;
        this.cancelButton = cancelButton;
        this.addClockButton = addClockButton;
        this.isHandlingNextStep = false;
        this.hasHandledNextStep = false;

        // 确保事件监听器只绑定一次
        this.addClockButton.addEventListener('click', () => {
            this.showDialog();
            this.hasHandledNextStep = false; // 重置标志
        });
    
        // 移除可能存在的重复绑定
        this.nextButton.removeEventListener('click', this.handleNextStep.bind(this));
        this.submitButton.removeEventListener('click', this.handleDialogSubmit.bind(this));
        this.cancelButton.removeEventListener('click', this.hideDialog.bind(this));
    
        // 绑定事件监听器
        this.nextButton.addEventListener('click', this.handleNextStep.bind(this));
        this.submitButton.addEventListener('click', this.handleDialogSubmit.bind(this));
        this.cancelButton.addEventListener('click', this.hideDialog.bind(this));
    }

    showDialog(): void {
        this.dialogContainer.style.display = 'flex';
        this.step1.style.display = 'block';
        this.step2.style.display = 'none';
    }

    hideDialog(): void {
        this.dialogContainer.style.display = 'none';
    }

    handleNextStep(): void {
        if (this.hasHandledNextStep) {
            console.log('handleNextStep called but ignored because it has already been called');
            return;
        }

        console.log('handleNextStep called'); // 调试信息
        this.hasHandledNextStep = true;

        const clockCount = parseInt((document.getElementById('clock-count') as HTMLInputElement).value, 10);
        console.log(`clockCount: ${clockCount}`); // 调试信息
        if (isNaN(clockCount) || clockCount <= 0) {
            alert('Please enter a valid number of clocks.');
            this.hasHandledNextStep = false; // 重新启用处理
            return;
        }

        const timezoneInputs = document.getElementById('timezone-inputs')!;
        timezoneInputs.innerHTML = ''; // 清空之前的输入框
        for (let i = 0; i < clockCount; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `Timezone offset for clock ${i + 1}`;
            input.classList.add('timezone-input');
            timezoneInputs.appendChild(input);
        }

        console.log('Switching to step 2'); // 调试信息
        this.step1.style.display = 'none';
        this.step2.style.display = 'block';
    }

    handleDialogSubmit(): void {
        console.log('handleDialogSubmit called'); // 调试信息
        const timezoneInputs = document.getElementsByClassName('timezone-input') as HTMLCollectionOf<HTMLInputElement>;
        const timezones: number[] = [];
        for (let i = 0; i < timezoneInputs.length; i++) {
            const timezoneOffset = parseInt(timezoneInputs[i].value, 10);
            if (isNaN(timezoneOffset)) {
                alert('Please enter a valid timezone offset.');
                return;
            }
            timezones.push(timezoneOffset);
        }

        console.log('Adding clocks'); // 调试信息
        this.addClocks(timezones.length, timezones);
        this.hideDialog();
    }

    addClocks(count: number, timezones: number[]): void {
        for (let i = 0; i < count; i++) {
            this.addClock(timezones[i]);
        }
    }

    addClock(timezoneOffset: number): void {
        const uniqueId = `time-display-${this.watches.length + 1}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`; // 生成唯一ID
        const existingElement = document.getElementById(uniqueId);
        if (existingElement) {
            console.log(`Clock with ID: ${uniqueId} already exists!`); // 检查是否已存在
            return;
        }

        console.log(`Creating clock with ID: ${uniqueId}`); // 日志记录ID
        const watch = new Watch(uniqueId, timezoneOffset); // 将唯一ID和时区偏移传递给Watch实例
        this.watches.push(watch);

        const clockElement = document.createElement('div');
        clockElement.className = 'clock';
        clockElement.id = uniqueId; // 设置唯一ID
        clockElement.innerHTML = `
            <div class="timezone">GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}</div>
            <div class="square">
          <h1 id="${uniqueId}">Loading...</h1>
          <div class="button-container">
           <button class="mode-button" data-id="${uniqueId}">Mode</button>
           <button class="increase-button" data-id="${uniqueId}">Increase</button>
           <button class="light-button" data-id="${uniqueId}">Light</button>
           <button class="reset-button" data-id="${uniqueId}">Reset</button>
           <button class="toggle-format-button" data-id="${uniqueId}">Format</button>
          </div>
          </div>

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
