import { WatchAnimator } from './watchAnimator';
import { Watch } from './watch';

export class ClockManager {
    private watches: Watch[] = [];
    private animators: WatchAnimator[] = []; // Save all WatchAnimator instances
    private container: HTMLElement;
    private dialogContainer: HTMLElement;
    private step1: HTMLElement;
    private step2: HTMLElement;
    private nextButton: HTMLElement;
    private submitButton: HTMLElement;
    private cancelButton: HTMLElement;
    private isAnimationEnabled: boolean = false; 
    private addClockButton: HTMLElement;
    // private isHandlingNextStep: boolean = false;
    // private isHandlingSubmit: boolean = false;

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
            // this.isHandlingNextStep = false; // reset
        });


        document.getElementById('start-animation-button')?.addEventListener('click', () => {
            this.startAllAnimations();
        });

        document.getElementById('stop-animation-button')?.addEventListener('click', () => {
            this.stopAllAnimations();
        });

        //buttons
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
        // if (this.isHandlingNextStep) return; // jump out
        // this.isHandlingNextStep = true; //
        console.log('handleNextStep called'); // messages
   
        const clockCount = parseInt((document.getElementById('clock-count') as HTMLInputElement).value, 10);
        console.log(`clockCount: ${clockCount}`); //  messages
        if (isNaN(clockCount) || clockCount <= 0) {
            alert('Please enter a valid number of clocks.');
            // this.isHandlingNextStep = false; // reset
            return;
        }

        const timezoneInputs = document.getElementById('timezone-inputs')!;
        timezoneInputs.innerHTML = ''; // empty input
        for (let i = 0; i < clockCount; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `Timezone offset for clock ${i + 1}`;
            input.classList.add('timezone-input');
            timezoneInputs.appendChild(input);
        }

        console.log('Switching to step 2'); //  messages
        this.step1.style.display = 'none';
        this.step2.style.display = 'block';

    }

    handleDialogSubmit(): void {
        // this.isHandlingSubmit = true; 
        console.log('handleDialogSubmit called'); //  messages
        const timezoneInputs = document.getElementsByClassName('timezone-input') as HTMLCollectionOf<HTMLInputElement>;
        const timezones: number[] = [];
        for (let i = 0; i < timezoneInputs.length; i++) {
            const timezoneOffset = parseInt(timezoneInputs[i].value, 10);
            if (isNaN(timezoneOffset)) {
                alert('Please enter a valid timezone offset.');
                // this.isHandlingSubmit = false;
                return;
            }
            timezones.push(timezoneOffset);
        }

        console.log('Adding clocks'); //  messages
        this.addClocks(timezones.length, timezones);
        // this.isHandlingSubmit = false;
        this.hideDialog();
    }

    addClocks(count: number, timezones: number[]): void {
        for (let i = 0; i < count; i++) {
            this.addClock(timezones[i]);
        }
    }
   addClock(timezoneOffset: number): void {
    const uniqueId = `clock-${this.watches.length + 1}`; // id don't change
    const existingElement = document.getElementById(uniqueId);
    if (existingElement) {
        console.log(`Clock with ID: ${uniqueId} already exists!`); // check
        return;
    }

    console.log(`Creating clock with ID: ${uniqueId}`); //message
    const watch = new Watch(uniqueId, timezoneOffset); 
    this.watches.push(watch);

    const clockElement = document.createElement('div');
    clockElement.className = 'clock';
    clockElement.id = uniqueId; // id
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

    // Bind an event listener with the data-id 
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

    // stop
    stopAllAnimations(): void {
        this.animators.forEach(animator => animator.stopAnimation());
    }

    // start all
    startAllAnimations(): void {
        this.isAnimationEnabled = true;
    }

    // isanimation?
    isAnimationActive(): boolean {
        return this.isAnimationEnabled;
    }
}
