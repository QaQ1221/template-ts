import { Time } from './time';
import { Light } from './light';

export class Watch {
    private currentTime: Time;
    
    private editMode: number;
    private light: Light;
    private uniqueId: string;
    private timezoneOffset: number;

    constructor(uniqueId: string, timezoneOffset: number) {
        this.currentTime = new Time(timezoneOffset);
        this.editMode = 0; 
        this.light = new Light(uniqueId); // send id
        this.uniqueId = uniqueId; // 
        this.timezoneOffset = timezoneOffset; //get timezone
    }

    displayTime(): void {
        console.log(`Current Time: ${this.currentTime.getTime()}`);
        this.updateDisplay(); 
    }

    modeButton(): void {
        this.editMode = (this.editMode + 1) % 3;
     
        console.log(`Mode changed to ${this.editMode === 1 ? 'edit hours' : this.editMode === 2 ? 'edit minutes' : 'not editable'}`);
    }

    increaseButton(): void {
        if (this.editMode === 1) {
            this.currentTime.increaseHour(); 
        } else if (this.editMode === 2) {
            this.currentTime.increaseMinute(); 
        }
        this.displayTime();
    }

    lightButton(): void {
        this.light.toggleLight();
    }
    
    toggleFormatButton(): void {
        this.currentTime.toggleFormat();
        this.displayTime();
    }
    
    resetButton(): void {
        const now = new Date();
        this.currentTime.resetTime(now, this.timezoneOffset); 
        this.displayTime();
    }

    private updateDisplay(): void {
        const timeDisplayElement = document.querySelector(`#${this.uniqueId} h1`); // getid 
        if (timeDisplayElement) {
            timeDisplayElement.textContent = `${this.currentTime.getTime()}`;
        }
    }

    getCurrentTime(): Time {
        return this.currentTime;
    }
}
