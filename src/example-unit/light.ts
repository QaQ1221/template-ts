export class Light {
    private isOn: boolean;

    constructor() {
        this.isOn = false;
    }

    toggleLight(): void {
        this.isOn = !this.isOn;
        console.log(`Light is now ${this.isOn ? 'ON' : 'OFF'}`);
        this.updateBackground();
    }
    private updateBackground(): void {
        const squareElement = document.querySelector('.square');
        if (squareElement) {
            if (this.isOn) {
                squareElement.classList.add('light-on');
            } else {
                squareElement.classList.remove('light-on');
            }
        }
    }
}