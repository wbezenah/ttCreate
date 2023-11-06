import { Shape, Square } from "../shared/shapes-math";
import { AssetType, TTCAsset } from "../shared/ttc-types";

export class Token implements TTCAsset {

    public readonly type = AssetType.TOKEN;

    constructor
    (
        public name: string = '',
        public shape: Shape = new Square(50),
        public backgroundImgPath: string  = ''
    ) { }
}