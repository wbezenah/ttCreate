export interface Shape {
    
}

export class Square implements Shape {
    constructor(public sideLength: number) { }

    toRectangle(): Rectangle {
        return new Rectangle(this.sideLength, this.sideLength);
    }

    toCircle(): Circle {
        return new Circle(this.sideLength / 2);
    }
}

export class Rectangle implements Shape {
    constructor(public length: number, public width: number) { }

    toSquare(useWidth = false) {
        return new Square(useWidth ? this.width : this.length);
    }

    toCircle(axis?: 'width' | 'length') {
        if(axis) {
            return new Circle(axis === 'width' ? this.width : this.length);
        }
        return new Circle(Math.max(this.width, this.length) / 2);
    }
}

export class Circle implements Shape {
    constructor(public radius: number) { }

    toSquare() {
        return new Square(this.radius * 2);
    }

    toRectangle() {
        return new Rectangle(this.radius * 2, this.radius * 2);
    }
}