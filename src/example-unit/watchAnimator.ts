// example-unit/watchAnimator.ts
import { Vector2, Matrix3x3 } from './math';

export class WatchAnimator {
    private rotationCenter: Vector2;
    private angle: number;
    private scale: number;
    private scaleDirection: number;

    constructor(private watchElement: HTMLElement, private container: HTMLElement) {
        this.rotationCenter = new Vector2(
            parseFloat((document.getElementById('rotation-center-x') as HTMLInputElement).value) || 0,
            parseFloat((document.getElementById('rotation-center-y') as HTMLInputElement).value) || 0
        );
        this.angle = 0;
        this.scale = 1;
        this.scaleDirection = 1;

        document.getElementById('start-animation-button')?.addEventListener('click', () => {
            this.startAnimation();
        });
    }

    private startAnimation(): void {
        requestAnimationFrame(() => this.animate());
    }

    private animate(): void {
        const rotationMatrix = Matrix3x3.rotation(this.angle);
        const scalingMatrix = Matrix3x3.scaling(this.scale, this.scale);
        const translationMatrixToCenter = Matrix3x3.translation(-this.rotationCenter.x, -this.rotationCenter.y);
        const translationMatrixBack = Matrix3x3.translation(this.rotationCenter.x, this.rotationCenter.y);

        const transformMatrix = translationMatrixBack
            .multiply(rotationMatrix)
            .multiply(scalingMatrix)
            .multiply(translationMatrixToCenter);

        const watchCenter = new Vector2(this.watchElement.offsetLeft + this.watchElement.offsetWidth / 2, this.watchElement.offsetTop + this.watchElement.offsetHeight / 2);
        const newCenter = transformMatrix.transformVector(watchCenter);

        this.watchElement.style.transform = `translate(${newCenter.x - this.watchElement.offsetWidth / 2}px, ${newCenter.y - this.watchElement.offsetHeight / 2}px) scale(${this.scale}) rotate(${this.angle}rad)`;

        this.angle += 0.01;
        this.scale += this.scaleDirection * 0.01;
        if (this.scale > 1.5 || this.scale < 0.5) {
            this.scaleDirection *= -1;
        }

        requestAnimationFrame(() => this.animate());
    }
}
