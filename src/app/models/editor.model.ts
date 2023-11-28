import { EditorType } from "../shared/ttc-types";

export class Editor {

    constructor(
      public type: EditorType,
      public name: string, 
      public closeable: boolean,
      public index: number
    ) { }

    close() {

    }

    equals(e2: Editor): boolean {
      return this.type == e2.type && this.index == e2.index;
    }
}