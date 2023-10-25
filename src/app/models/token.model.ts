import { Shape } from "../shared/shapes-math";

export class Token {
    backgroundImg?: string;
    shape: Shape;

    constructor(public title: string) {

    }
}