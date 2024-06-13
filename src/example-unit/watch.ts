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

        this.editMode = 0; // 0: 不可编辑，1: 编辑小时，2: 编辑分钟
        this.light = new Light(uniqueId); // 将唯一ID传递给Light实例
        this.uniqueId = uniqueId; // 接收唯一ID
        this.timezoneOffset = timezoneOffset; // 保存时区偏移量
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
        this.currentTime.resetTime(now, this.timezoneOffset); // 使用当前时间和时区偏移重置时间
        this.displayTime();
    }

    private updateDisplay(): void {
        const timeDisplayElement = document.querySelector(`#${this.uniqueId} h1`); // 使用唯一ID获取元素
        if (timeDisplayElement) {
            timeDisplayElement.textContent = `${this.currentTime.getTime()}`;
        }
    }

    getCurrentTime(): Time {
        return this.currentTime;
    }
}
