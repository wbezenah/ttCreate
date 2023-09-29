export enum EditorType {
    MAIN = 'Main',
    BOARD = 'Board',
    DECK = 'Deck',
    TOKEN = 'Token'
  }

export class Editor {
    type: EditorType;
    name: string;
    closeable: boolean;
}