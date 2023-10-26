import { AssetType, TTCAsset } from "../shared/ttc-types";
import { Card } from "./card.model";

export class Deck implements TTCAsset{
    public readonly type = AssetType.DECK;

    backgroundImg?: string;
    cards: Card[] = [];

    constructor(public name: string) {

    }
}