import { Injectable } from '@angular/core';

export enum Editor {
  MAIN = 'Main',
  BOARD = 'Board',
  DECK = 'Deck',
  TOKEN = 'Token'
}

@Injectable({
  providedIn: 'root'
})
export class EditorSwitchService {

  private active_editor: Editor = Editor.MAIN;

  constructor() { }

  get activeEditor(): Editor {
    return this.active_editor;
  }

  isActive(editor: Editor): boolean {
    return this.active_editor === editor;
  }

  setActiveEditor(editor: Editor): Editor {
    this.active_editor = editor;
    return this.active_editor;
  }

  getActiveComponents(): {toolsWindow: string, editorWindow: string, assetsWindow: string} {
    return {
      toolsWindow: this.active_editor + 'ToolsComponent',
      editorWindow: this.active_editor + 'EditorComponent',
      assetsWindow: this.active_editor + 'AssetsComponent'
    };
  }
}
