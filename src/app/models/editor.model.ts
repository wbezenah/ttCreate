export enum EditorType {
    MAIN = 'Main',
    BOARD = 'Board',
    DECK = 'Deck',
    TOKEN = 'Token'
  }

export class Editor {

    constructor(
      public type: EditorType,
      public name: string, 
      public closeable: boolean
    ) { }

    close() {

    }
}