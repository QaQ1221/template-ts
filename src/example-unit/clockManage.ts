import { WatchAnimator } from './watchAnimator';
import { Watch } from './watch';

export class ClockManager {
    private watches: Watch[] = [];
    private animators: WatchAnimator[] = []; // 保存所有的 WatchAnimator 实例
    private container: HTMLElement;
    private dialogContainer: HTMLElement;
    private step1: HTMLElement;
    private step2: HTMLElement;
    private nextButton: HTMLElement;
    private submitButton: HTMLElement;
    private cancelButton: HTMLElement;
    private isAnimationEnabled: boolean = false; // 全局动画开关
    private addClockButton: HTMLElement;
    private isHandlingNextStep: boolean = false;
    private isHandlingSubmit: boolean = false;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        const dialogContainer = document.getElementById('dialog-container');
        const step1 = document.getElementById('step-1');
        const step2 = document.getElementById('step-2');
        const nextButton = document.getElementById('next-button');
        const submitButton = document.getElementById('submit-button');
        const cancelButton = document.getElementById('cancel-button');
        const addClockButton = document.getElementById('add-clock-button');
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
        this.addClockButton.addEventListener('click', () => {
            this.showDialog();
            this.isHandlingNextStep = false; // 重置标志
        });


        document.getElementById('start-animation-button')?.addEventListener('click', () => {
            this.startAllAnimations();
        });

        document.getElementById('stop-animation-button')?.addEventListener('click', () => {
            this.stopAllAnimations();
        });

        // 绑定事件监听器
        this.nextButton.addEventListener('click', this. handleNextStep.bind(this));
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
        if (this.isHandlingNextStep) return; // 如果已经在处理，则返回
        this.isHandlingNextStep = true; //
        console.log('handleNextStep called'); // 调试信息
   
        const clockCount = parseInt((document.getElementById('clock-count') as HTMLInputElement).value, 10);
        console.log(`clockCount: ${clockCount}`); // 调试信息
        if (isNaN(clockCount) || clockCount <= 0) {
            alert('Please enter a valid number of clocks.');
            this.isHandlingNextStep = false; // 重置标志变量
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
        this.isHandlingSubmit = true; // 设置标志变量
        console.log('handleDialogSubmit called'); // 调试信息
        const timezoneInputs = document.getElementsByClassName('timezone-input') as HTMLCollectionOf<HTMLInputElement>;
        const timezones: number[] = [];
        for (let i = 0; i < timezoneInputs.length; i++) {
            const timezoneOffset = parseInt(timezoneInputs[i].value, 10);
            if (isNaN(timezoneOffset)) {
                alert('Please enter a valid timezone offset.');
                this.isHandlingSubmit = false;
                return;
            }
            timezones.push(timezoneOffset);
        }

        console.log('Adding clocks'); // 调试信息
        this.addClocks(timezones.length, timezones);
        this.isHandlingSubmit = false;
        this.hideDialog();
    }

    addClocks(count: number, timezones: number[]): void {
        for (let i = 0; i < count; i++) {
            this.addClock(timezones[i]);
        }
    }
   addClock(timezoneOffset: number): void {
    const uniqueId = `clock-${this.watches.length + 1}`; // 生成唯一ID，基于表盘数量
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
        <div class="clock-id">ID: ${uniqueId}</div>
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

    const animator = new WatchAnimator(clockElement, this.container, this);
    this.animators.push(animator);

    setInterval(() => {
        const currentTime = watch.getCurrentTime();
        currentTime.increaseSecond();
        watch.updateDisplay();
    }, 1000);
}

    // 停止所有动画
    stopAllAnimations(): void {
        this.animators.forEach(animator => animator.stopAnimation());
    }

    // 启动所有动画
    startAllAnimations(): void {
        this.isAnimationEnabled = true;
    }

    // 检查动画是否启用
    isAnimationActive(): boolean {
        return this.isAnimationEnabled;
    }
}
