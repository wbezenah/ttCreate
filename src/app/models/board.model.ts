import { AssetType, TTCAsset } from "../shared/ttc-types";

export class Board implements TTCAsset {
    public readonly type = AssetType.BOARD;

    backgroundImg?: string;

    constructor(public name: string) {

    }
}