import { Time } from './time';
import { Light } from './light';

export class Watch {
    private currentTime: Time;
    private isEditable: boolean;
    private editMode: number;
    private light: Light;

    constructor() {
        this.currentTime = new Time();
        this.isEditable = false;
        this.editMode = 0; // 0: not editable, 1: edit hours, 2: edit minutes
        this.light = new Light();
    }

    displayTime(): void {
        console.log(`Current Time: ${this.currentTime.getTime()}`);
        this.updateDisplay(); 
    }

    modeButton(): void {
        this.editMode = (this.editMode + 1) % 3;
        this.isEditable = this.editMode !== 0;
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
        this.currentTime.resetTime();
        this.displayTime();
    }

    private updateDisplay(): void {
        const timeDisplayElement = document.getElementById('time-display');
        if (timeDisplayElement) {
            timeDisplayElement.textContent = `${this.currentTime.getTime()}`;
        }
    }

    getCurrentTime(): Time {
        return this.currentTime;
    }

    getUniqueId(): string {
        return `${this.currentTime.getHours()}-${this.currentTime.getMinutes()}-${this.currentTime.getSeconds()}`;
    }

}
