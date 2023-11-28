import { AssetType, TTCAsset } from "../shared/ttc-types";

export class Deck implements TTCAsset{
    readonly type = AssetType.DECK;

    backgroundImg?: string;
    cards: number[];

    constructor(
        public name: string,
        public index: number
    ) {

    }
}