import { Rectangle, Shape } from "../../shared/shapes-math";
import { AssetType, TTCAsset } from "../../shared/ttc-types";

export class Deck implements TTCAsset{
    readonly type = AssetType.DECK;

    backgroundImg?: string;
    cards: number[];

    constructor(
        public name: string,
        public index: number,
        public shape: Shape = new Rectangle(100, 50),
        public position: {x: number, y: number} = {x: 0, y: 0}
    ) {

    }
}