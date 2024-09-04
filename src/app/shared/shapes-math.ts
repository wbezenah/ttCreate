export { r2d, d2r, roundTo, toSquare, toRectangle, toCircle, toRegPolygon };
export { Shape, Square, Rectangle, Triangle, Circle, RegPolygon };

function r2d (rad: number) { return rad * 180 / Math.PI; };
function d2r (deg: number) { return deg * Math.PI / 180; };
function roundTo (n: number, round_to: number) { return Math.round(n * (10**round_to)) / (10**round_to); };

function calcTriAngles(a: number, b: number, c: number, round_to_n = 4) {
    const ab = roundTo(r2d(Math.acos((a**2 + b**2 - c**2) / (2 * a * b))), round_to_n);
    const bc = roundTo(r2d(Math.acos((b**2 + c**2 - a**2) / (2 * b * c))), round_to_n);
    const ac = roundTo(180 - ab - bc, round_to_n);
    return {theta_ab: ab, theta_bc: bc, theta_ac: ac};
}

export enum ShapeType {
    SQUARE = 'square',
    RECTANGLE = 'rectangle',
    TRIANGLE = 'triangle',
    CIRCLE = 'circle',
    REG_POLY = 'regpoly'
}

interface Shape { 
    readonly shape_type: ShapeType;
}

class Square implements Shape {
    shape_type = ShapeType.SQUARE;

    constructor(public sideLength: number) { }

    get area() {
        return this.sideLength * this.sideLength;
    }

    get perimeter() {
        return 4 * this.sideLength;
    }
}

class Rectangle implements Shape {
    shape_type = ShapeType.RECTANGLE;

    constructor(public length: number, public width: number) { }

    get area() {
        return this.length * this.width;
    }

    get perimeter() {
        return 2*this.length + 2*this.width;
    }
}

class Triangle implements Shape {
    shape_type = ShapeType.TRIANGLE;

    private _angles: {
        theta_ab: number;
        theta_bc: number;
        theta_ac: number;
    }

    private _sides: {
        side_a: number;
        side_b: number;
        side_c: number;
    }

    constructor(a: number, b: number, c: number) {
        this._sides = { side_a: a, side_b: b, side_c: c };
        if(
            a + b < c ||
            a + c < b ||
            b + c < a
        ) { throw new Error(`INVALID TRIANGLE SIZE ${this._sides}`); }

        this._angles = calcTriAngles(this._sides.side_a, this._sides.side_b, this._sides.side_c);
    }

    get angles() { return this._angles; }
    get sides() { return this._sides; }
    
    set sides(sides: {side_a: number, side_b: number, side_c: number}) {
        this._sides = sides;
        this._angles = calcTriAngles(this._sides.side_a, this._sides.side_b, this._sides.side_c);
    }
}

class Circle implements Shape {
    shape_type = ShapeType.CIRCLE;

    constructor(public radius: number) { }
}

class RegPolygon implements Shape {
    static readonly MIN_SIDES: number = 3;
    shape_type = ShapeType.REG_POLY;

    private _interior_angle: number;
    private _exterior_angle: number;

    constructor(private _num_sides: number, private _side_length: number) {
        if(this._num_sides < RegPolygon.MIN_SIDES) { throw new Error(`INVALID REG_POLYGON SIZE ${this._num_sides}`); }

        this._interior_angle = (this._num_sides - 2) * 180 / this._num_sides;
        this._exterior_angle = 360 / this._num_sides;
    }

    get interior_angle() { return this._interior_angle; }
    get exterior_angle() { return this._exterior_angle; }
    get num_sides() { return this._num_sides;}
    get side_length() { return this._side_length; }

    set side_length(length: number) { this._side_length = length; }
    set num_sides(num: number) {
        this._num_sides = num;
        this._interior_angle = (this._num_sides - 2) * 180 / this._num_sides;
        this._exterior_angle = 360 / this._num_sides;
    }
}

type side_spec = 'max' | 'min' | number;

function toSquare(shape: Shape, use_for_side: side_spec = 'max'): Square {
    switch(shape.shape_type) {
        case ShapeType.SQUARE:
            return shape as Square;
        case ShapeType.RECTANGLE:
            const rect = shape as Rectangle;
            return new Square(use_for_side === 'max' ? Math.max(rect.length, rect.width) : use_for_side === 'min' ? Math.min(rect.length, rect.width) : use_for_side >= 1 ? rect.width : rect.length);

        case ShapeType.TRIANGLE:
            const tri_sides = (shape as Triangle).sides;
            return new Square(use_for_side === 'max' ? Math.max(...Object.values(tri_sides)) : use_for_side === 'min' ? Math.min(...Object.values(tri_sides)) : use_for_side >= 2 ? tri_sides.side_c : use_for_side === 1 ? tri_sides.side_b : tri_sides.side_a);

        case ShapeType.CIRCLE:
            const circle = shape as Circle;
            return new Square(2 * circle.radius);

        case ShapeType.REG_POLY:
            const poly = shape as RegPolygon;
            return new Square(poly.side_length);

        default:
            return null;
    }
}

function toRectangle(shape: Shape, use_for_length: side_spec = 'max', use_for_width: side_spec = 'max'): Rectangle {
    switch(shape.shape_type) {
        case ShapeType.SQUARE:
            const square = shape as Square;
            return new Rectangle(square.sideLength, square.sideLength);
            
        case ShapeType.RECTANGLE:
            return shape as Rectangle;

        case ShapeType.TRIANGLE:
            const tri_sides = (shape as Triangle).sides;
            const nLength = use_for_length === 'max' ? Math.max(...Object.values(tri_sides)) : use_for_length === 'min' ? Math.min(...Object.values(tri_sides)) : use_for_length >= 2 ? tri_sides.side_c : use_for_length === 1 ? tri_sides.side_b : tri_sides.side_a;
            const nWidth = use_for_width === 'max' ? Math.max(...Object.values(tri_sides)) : use_for_width === 'min' ? Math.min(...Object.values(tri_sides)) : use_for_width >= 2 ? tri_sides.side_c : use_for_width === 1 ? tri_sides.side_b : tri_sides.side_a;
            return new Rectangle(nLength, nWidth);

        case ShapeType.CIRCLE:
            const circle = shape as Circle;
            return new Rectangle(circle.radius * 2, circle.radius * 2);

        case ShapeType.REG_POLY:
            const poly = shape as RegPolygon;
            return new Rectangle(poly.side_length, poly.side_length);

        default:
            return null;
    }
}

function toCircle(shape: Shape, use_for_radius: side_spec = 'max'): Circle {
    switch(shape.shape_type) {
        case ShapeType.SQUARE:
            const square = shape as Square;
            return new Circle(square.sideLength / 2);
            
        case ShapeType.RECTANGLE:
            const rect = shape as Rectangle;
            return new Circle(use_for_radius === 'max' ? Math.max(rect.length, rect.width) / 2 : use_for_radius === 'min' ? Math.min(rect.length, rect.width) / 2 : use_for_radius >= 1 ? rect.width / 2 : rect.length / 2);

        case ShapeType.TRIANGLE:
            const tri_sides = (shape as Triangle).sides;
            return new Circle(use_for_radius === 'max' ? Math.max(...Object.values(tri_sides)) : use_for_radius === 'min' ? Math.min(...Object.values(tri_sides)) : use_for_radius >= 2 ? tri_sides.side_c : use_for_radius === 1 ? tri_sides.side_b : tri_sides.side_a);

        case ShapeType.CIRCLE:
            return shape as Circle;

        case ShapeType.REG_POLY:
            const poly = shape as RegPolygon;
            return new Circle(poly.side_length);

        default:
            return null;
    }
}

function toRegPolygon(shape: Shape, use_for_side: side_spec = 'max', num_sides: number = RegPolygon.MIN_SIDES): RegPolygon {
    const rp_num_sides = Math.max(num_sides, RegPolygon.MIN_SIDES);
    switch(shape.shape_type) {
        case ShapeType.SQUARE:
            const square = shape as Square;
            return new RegPolygon(rp_num_sides, square.sideLength);
            
        case ShapeType.RECTANGLE:
            const rect = shape as Rectangle;
            return new RegPolygon(rp_num_sides, use_for_side === 'max' ? Math.max(rect.length, rect.width) : use_for_side === 'min' ? Math.min(rect.length, rect.width) : use_for_side >= 1 ? rect.width : rect.length);

        case ShapeType.TRIANGLE:
            const tri_sides = (shape as Triangle).sides;
            return new RegPolygon(rp_num_sides, use_for_side === 'max' ? Math.max(...Object.values(tri_sides)) : use_for_side === 'min' ? Math.min(...Object.values(tri_sides)) : use_for_side >= 2 ? tri_sides.side_c : use_for_side === 1 ? tri_sides.side_b : tri_sides.side_a);

        case ShapeType.CIRCLE:
            const circle = shape as Circle;
            return new RegPolygon(rp_num_sides, circle.radius);

        case ShapeType.REG_POLY:
            return shape as RegPolygon;

        default:
            return null;
    }
}