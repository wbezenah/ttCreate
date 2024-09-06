import { Rectangle, Shape } from "../../shared/shapes-math";
import { AssetType, TTCAsset } from "../../shared/ttc-types";

export class Board implements TTCAsset {
    readonly type = AssetType.BOARD;

    backgroundImg?: string;

    constructor(
        public name: string,
        public index: number,
        public shape: Shape = new Rectangle(300, 300),
        public position: {x: number, y: number} = {x: 0, y: 0}
    ) {

    }
}