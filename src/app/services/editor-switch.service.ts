import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorSwitchService {

  private editors: Map<string, boolean> = new Map<string, boolean>([
    ['main', true],
    ['board', false],
    ['deck', false],
    ['token', false]
  ]);

  private active_editor = 'main';

  constructor() { }

  get activeEditor(): string {
    return this.activeEditor;
  }

  isActive(editor: string): boolean {
    return this.editors.get(editor);
  }

  setActiveEditor(editor: string): boolean {
    if(this.editors.has(editor)) {
      this.editors.set(this.active_editor, false);
      this.active_editor = editor;
      this.editors.set(this.active_editor, true);
      return true;
    }else {
      return false;
    }
  }
}
