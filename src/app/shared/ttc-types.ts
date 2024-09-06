import { Token } from "../models/assets/token.model";
import { Board } from "../models/assets/board.model";
import { Deck } from "../models/assets/deck.model";
import { Card } from "../models/assets/card.model";
import { Shape } from "./shapes-math";

export { TTCAsset, AssetType, EditorType, FileTypeSet }
export { ETYPE_TO_ATYPE, ATYPE_TO_ETYPE, ATYPE_TO_A }

enum AssetType {
    BOARD = 'Board',
    CARD = 'Card',
    DECK = 'Deck',
    TOKEN = 'Token'
}

enum EditorType {
    MAIN = 'Main',
    BOARD = 'Board',
    DECK = 'Deck',
    TOKEN = 'Token'
}

function ETYPE_TO_ATYPE(type: EditorType): AssetType {
    switch(type) {
        case EditorType.BOARD:
            return AssetType.BOARD;
        case EditorType.DECK:
            return AssetType.DECK;
        case EditorType.TOKEN:
            return AssetType.TOKEN;
        case EditorType.MAIN:
            return;
    }
}

function ATYPE_TO_ETYPE(type: AssetType): EditorType {
    switch(type) {
        case AssetType.BOARD:
            return EditorType.BOARD;
        case AssetType.CARD:
            return;                 //update when/if card editor exists
        case AssetType.DECK:
            return EditorType.DECK;
        case AssetType.TOKEN:
            return EditorType.TOKEN;
    }
}

function ATYPE_TO_A(type: AssetType): typeof Board | typeof Card | typeof Deck | typeof Token {
    switch(type) {
        case AssetType.BOARD:
            return Board;
        case AssetType.CARD:
            return Card;
        case AssetType.DECK:
            return Deck;
        case AssetType.TOKEN:
            return Token;
    }
}

namespace FileTypeSet {
    export const allTypes = {extensions: ['*'], name: 'All Files'}
    export const imageTypes = {extensions: ['png', 'jpg'], name: 'Images'}
    export const projectType = {extensions: ['ttcp'], name: 'TTC Projects'}
}

interface TTCAsset {
    type: AssetType;
    shape: Shape;
    index: number;
    name: string;
    position: {x: number, y: number};
}