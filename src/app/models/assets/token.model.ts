import { Rectangle, Shape, Square } from "../../shared/shapes-math";
import { AssetType, TTCAsset } from "../../shared/ttc-types";

export class Token implements TTCAsset {
    readonly type = AssetType.TOKEN;

    constructor
    (
        public name: string,
        public index: number,
        public shape: Shape = new Rectangle(50, 50),
        public backgroundImgURL: string  = '',
        public top: number = 0,
        public left: number = 0
    ) { }
}