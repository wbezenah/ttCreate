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
}