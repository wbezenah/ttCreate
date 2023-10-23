import { Shape } from "../shared/shapes";

export class Token {
    backgroundImg?: string;
    shape: Shape;

    constructor(public title: string) {

    }
}