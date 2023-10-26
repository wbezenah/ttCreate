import { AssetType, TTCAsset } from "../shared/ttc-types";

export class Card implements TTCAsset {
    public readonly type = AssetType.CARD;

    backgroundImg?: string;

    constructor(public name: string) {

    }
}