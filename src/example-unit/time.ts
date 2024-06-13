export class Time {
    private hours: number;
    private minutes: number;
    private seconds: number;
    private is24Hour: boolean;

    constructor(timezoneOffset: number) {
        const now = new Date();
        const timeWithOffset = this.convertToGMTOffset(now, timezoneOffset);
        this.hours = timeWithOffset.hours;
        this.minutes = timeWithOffset.minutes;
        this.seconds = timeWithOffset.seconds;
        this.is24Hour = true;
    }

    private convertToGMTOffset(date: Date, offset: number): { hours: number, minutes: number, seconds: number } {
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const utcSeconds = date.getUTCSeconds();
        const gmtOffsetHours = (utcHours + offset) % 24;

        return {
            hours: gmtOffsetHours,
            minutes: utcMinutes,
            seconds: utcSeconds
        };
    }

    increaseHour(): void {
        this.hours = (this.hours + 1) % 24;
    }

    increaseMinute(): void {
        this.minutes += 1;
        if (this.minutes >= 60) {
            this.minutes = 0;
            this.increaseHour();
        }
    }

    increaseSecond(): void {
        this.seconds += 1;
        if (this.seconds >= 60) {
            this.seconds = 0;
            this.increaseMinute();
        }
    }

    // 修改 resetTime 方法以接受 Date 对象和 offset 参数
    resetTime(date: Date, offset: number): void {
        const timeWithOffset = this.convertToGMTOffset(date, offset);
        this.hours = timeWithOffset.hours;
        this.minutes = timeWithOffset.minutes;
        this.seconds = timeWithOffset.seconds;
    }

    getTime(): string {
        if (this.is24Hour) {
            return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
        } else {
            const period = this.hours >= 12 ? 'PM' : 'AM';
            const hours = this.hours % 12 || 12;
            return `${hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')} ${period}`;
        }
    }

    getHours(): number {
        return this.hours;
    }

    getMinutes(): number {
        return this.minutes;
    }

    getSeconds(): number {
        return this.seconds;
    }

    toggleFormat(): void {
        this.is24Hour = !this.is24Hour;
    }
}
