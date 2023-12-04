import { Rectangle, Shape } from "../../shared/shapes-math";
import { AssetType, TTCAsset } from "../../shared/ttc-types";

export class Card implements TTCAsset {
    readonly type = AssetType.CARD;

    backgroundImg?: string;

    constructor(
        public name: string,
        public index: number,
        public shape: Shape = new Rectangle(100, 50)
    ) {

    }
}