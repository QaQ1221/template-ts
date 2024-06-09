export class Time {
    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor() {
        const now = new Date();
        const gmt1Time = this.convertToGMT1(now);
        this.hours = gmt1Time.hours;
        this.minutes = gmt1Time.minutes;
        this.seconds = gmt1Time.seconds;
    }

    private convertToGMT1(date: Date): { hours: number, minutes: number, seconds: number } {
        const utcHours = date.getUTCHours();
        const utcMinutes = date.getUTCMinutes();
        const utcSeconds = date.getUTCSeconds();
        const gmt1Hours = (utcHours + 1) % 24;

        return {
            hours: gmt1Hours,
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
    resetTime(): void {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    getTime(): string {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
    }

    updateToCurrentTime(hoursOverride?: number,minutesOverride?: number,secondsOverride?: number): void {
        const now = new Date();
        const gmt1Time = this.convertToGMT1(now);
        this.hours = hoursOverride !== undefined ? hoursOverride : gmt1Time.hours;
        this.minutes = minutesOverride !=undefined ? minutesOverride : gmt1Time.minutes;
        this.seconds = secondsOverride !== undefined ? secondsOverride : gmt1Time.seconds;
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
}
