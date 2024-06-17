
export class Vector2 {
    constructor(public x: number, public y: number) {}

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    scale(s: number): Vector2 {
        return new Vector2(this.x * s, this.y * s);
    }
}

export class Matrix3x3 {
    constructor(public m:[[number, number, number], [number, number, number], [number, number, number]] ) {}

    static identity(): Matrix3x3 {
        return new Matrix3x3([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]);
    }

    static translation(tx: number, ty: number): Matrix3x3 {
        return new Matrix3x3([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ]);
    }

    static rotation(angle: number): Matrix3x3 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Matrix3x3([
            [c, -s, 0],
            [s, c, 0],
            [0, 0, 1]
        ]);
    }

    static scaling(sx: number, sy: number): Matrix3x3 {
        return new Matrix3x3([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]);
    }

    multiply(other: Matrix3x3): Matrix3x3 {
        const result = Matrix3x3.identity().m;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i][j] = this.m[i][0] * other.m[0][j] +
                               this.m[i][1] * other.m[1][j] +
                               this.m[i][2] * other.m[2][j];
            }
        }
        return new Matrix3x3(result);
    }

    transformVector(v: Vector2): Vector2 {
        const x = this.m[0][0] * v.x + this.m[0][1] * v.y + this.m[0][2];
        const y = this.m[1][0] * v.x + this.m[1][1] * v.y + this.m[1][2];
        return new Vector2(x, y);
    }
}
