export class Light {
    private isOn: boolean;
    private uniqueId: string;

    constructor(uniqueId: string) {
        this.isOn = false;
        this.uniqueId = uniqueId; // get id
    }

    toggleLight(): void {
        this.isOn = !this.isOn;
        console.log(`Light is now ${this.isOn ? 'ON' : 'OFF'}`);
        this.updateBackground();
    }

    private updateBackground(): void {
        const squareElement = document.querySelector(`#${this.uniqueId} .square`);
        if (squareElement) {
            if (this.isOn) {
                squareElement.classList.add('light-on');
            } else {
                squareElement.classList.remove('light-on');
            }
        }
    }
}
