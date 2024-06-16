// example-unit/watchAnimator.ts
import { Vector2, Matrix3x3 } from './math';
import { ClockManager } from './clockManage';

export class WatchAnimator {
    private rotationCenter: Vector2;
    private angle: number;
    private scale: number;//Current zoom ratio
    private scaleDirection: number;
    private isAnimating: boolean;  // New flag variable to control animation state
    private animationFrameId: number | null;// ID of the animation frame

    constructor(private watchElement: HTMLElement, private container: HTMLElement, private clockManager: ClockManager) {
        // Initialize the center of rotation, defaults to the value in the input box or 0
        this.rotationCenter = new Vector2(
            parseFloat((document.getElementById('rotation-center-x') as HTMLInputElement).value) || 0,
            parseFloat((document.getElementById('rotation-center-y') as HTMLInputElement).value) || 0
        );
        this.angle = 0;
        this.scale = 1;
        this.scaleDirection = 1;
        this.isAnimating = false;
        this.animationFrameId = null;
        this.watchElement.addEventListener('click', () => {
            if (this.clockManager.isAnimationActive()) {
                this.isAnimating ? this.stopAnimation() : this.startAnimation();
            }
        });

    }

    public startAnimation(): void {
        this.isAnimating = true;
        this.animate();
    }

    public stopAnimation(): void {
        this.isAnimating = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private animate(): void {
        if (!this.isAnimating) return;// If the animation state is false, the animation is not executed.
        console.log(`Rotation center: x=${this.rotationCenter.x}, y=${this.rotationCenter.y}`); // 打印旋转中心的值
        this.rotationCenter = new Vector2(
        parseFloat((document.getElementById('rotation-center-x') as HTMLInputElement).value) || 0,
        parseFloat((document.getElementById('rotation-center-y') as HTMLInputElement).value) || 0
        );
        const rotationMatrix = Matrix3x3.rotation(this.angle);
        const scalingMatrix = Matrix3x3.scaling(this.scale, this.scale);
        const translationMatrixToCenter = Matrix3x3.translation(-this.rotationCenter.x, -this.rotationCenter.y);
        const translationMatrixBack = Matrix3x3.translation(this.rotationCenter.x, this.rotationCenter.y);

        const transformMatrix = translationMatrixBack
            .multiply(rotationMatrix)
            .multiply(scalingMatrix)
            .multiply(translationMatrixToCenter);

        const watchCenter = new Vector2(
            this.watchElement.offsetLeft + this.watchElement.offsetWidth / 2,
            this.watchElement.offsetTop + this.watchElement.offsetHeight / 2);
        const newCenter = transformMatrix.transformVector(watchCenter);
      // Update the CSS transform property of the dial
        this.watchElement.style.transform = `translate(${newCenter.x - this.watchElement.offsetWidth / 2}px, ${newCenter.y - this.watchElement.offsetHeight / 2}px) scale(${this.scale}) rotate(${this.angle}rad)`;

        this.angle += 0.0005;
        this.scale += this.scaleDirection * 0.0001;
        if (this.scale > 1.005 || this.scale < 0.995) {
            this.scaleDirection *= -1;
        }
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
}
