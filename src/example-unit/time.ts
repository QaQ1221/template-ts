// example-unit/time.ts
export class Time {
    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor() {
        const now = new Date();
        const gmt1Time = this.convertToGMT1(now);
        this.hours = gmt1Time.hours;
        this.minutes = gmt1Time.minutes;
        this.seconds=gmt1Time.seconds;
    }

    private convertToGMT1(date: Date): { hours: number, minutes: number,seconds: number } {
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const utcSeconds = date.getUTCSeconds();

        const gmt1Hours = (utcHours + 1) % 24; // Add 1 hour to convert to GMT+1

        return {
            hours: gmt1Hours,
            minutes: utcMinutes,
            seconds:utcSeconds
        };
    }

    increaseHour(): void {
        this.hours = (this.hours + 1) % 24;
    }

    increaseMinute(): void {
        this.minutes = (this.minutes + 1) % 60;
    }


    resetTime(): void {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    getTime(): string {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
    }

    updateToCurrentTime(): void {
        const now = new Date();
        const gmt1Time = this.convertToGMT1(now);
        this.hours = gmt1Time.hours;
        this.minutes = gmt1Time.minutes;
        this.seconds = gmt1Time.seconds;
    }
    
    addTime(hours: number, minutes: number): void {
        this.hours = (this.hours + hours) % 24;
        this.minutes = (this.minutes + minutes) % 60;
    }
    getHours(): number {
        return this.hours;
    }

    getMinutes(): number {
        return this.minutes;
    }
}
