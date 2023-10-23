import { Card } from "./card.model";

export class Deck {
    backgroundImg?: string;

    cards: Card[] = [];

    constructor(public title: string) {

    }
}