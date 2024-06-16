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
   

      
        this.addClockButton.addEventListener('click', () => {
            this.showDialog();
        });
    
        
        this.nextButton.removeEventListener('click', this.handleNextStep.bind(this));
        this.submitButton.removeEventListener('click', this.handleDialogSubmit.bind(this));
        this.cancelButton.removeEventListener('click', this.hideDialog.bind(this));
    
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

        console.log('handleNextStep called'); //  
   
        const clockCount = parseInt((document.getElementById('clock-count') as HTMLInputElement).value, 10);
        console.log(`clockCount: ${clockCount}`); //  
        if (isNaN(clockCount) || clockCount <= 0) {
            alert('Please enter a valid number of clocks.');
            return;
        }

        const timezoneInputs = document.getElementById('timezone-inputs')!;
        timezoneInputs.innerHTML = ''; // Clear the previous input box
        for (let i = 0; i < clockCount; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `Timezone offset for clock ${i + 1}`;
            input.classList.add('timezone-input');
            timezoneInputs.appendChild(input);
        }

        console.log('Switching to step 2'); //  
        this.step1.style.display = 'none';
        this.step2.style.display = 'block';
    }

    handleDialogSubmit(): void {
        console.log('handleDialogSubmit called'); 
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

        console.log('Adding clocks'); 
        this.addClocks(timezones.length, timezones);
        this.hideDialog();
    }

    addClocks(count: number, timezones: number[]): void {
        for (let i = 0; i < count; i++) {
            this.addClock(timezones[i]);
        }
    }

    addClock(timezoneOffset: number): void {
        const uniqueId = `clock-${this.watches.length + 1}`; // uniqueId
        const existingElement = document.getElementById(uniqueId);
        if (existingElement) {
            console.log(`Clock with ID: ${uniqueId} already exists!`);  // Check if it already exists
            return;
        }

        console.log(`Creating clock with ID: ${uniqueId}`); 
        const watch = new Watch(uniqueId, timezoneOffset); // Pass the unique ID and time zone offset to the Watch instance
        this.watches.push(watch);

        const clockElement = document.createElement('div');
        clockElement.className = 'clock';
        clockElement.id = uniqueId; // set id
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

        setInterval(() => {
            const currentTime = watch.getCurrentTime();
            currentTime.increaseSecond();
            watch.displayTime();
        }, 1000);
    }
}
