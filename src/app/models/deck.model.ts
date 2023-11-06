import { AssetType, TTCAsset } from "../shared/ttc-types";

export class Deck implements TTCAsset{
    public readonly type = AssetType.DECK;

    backgroundImg?: string;
    cards: number[];

    constructor(public name: string) {

    }
}