import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Editor} from '../models/editor.model';
import { ETYPE_TO_ATYPE, EditorType } from '../shared/ttc-types';
import { ProjectService } from './project.service';
import { IPCChannels } from '../shared/electron-com';

@Injectable({
  providedIn: 'root'
})
export class EditorSwitchService {

  private active_editor: Editor;
  private open_editors: Editor[] = [new Editor(EditorType.MAIN, 'Main', false, -1)];

  activeEditorUpdate: Subject<EditorType> = new Subject<EditorType>();

  constructor(
    private projectService: ProjectService
  ) {
    this.active_editor = this.open_editors[0];
  }

  switchNewAsset(value: {channel: IPCChannels, data: string}, type: EditorType) {
    if(value.channel === IPCChannels.modalRes) {
      const index = this.projectService.newAsset(ETYPE_TO_ATYPE(type), value.data);
      this.createNewEditor(value.data, index, type);
    }
  }

  getActiveEditor(): Editor {
    return this.active_editor;
  }

  isActive(editor: Editor): boolean {
    return this.active_editor === editor;
  }

  setActiveEditor(index: number): EditorType {
    if(this.active_editor.equals(this.open_editors[index])) { return this.active_editor.type; }
      
    this.active_editor = this.open_editors[index];
    this.activeEditorUpdate.next(this.active_editor.type);
    return this.active_editor.type;
  }

  closeEditor(index: number) {
    if(index == 0) {
      console.error("ERROR: Attempting to close Main");
      return;
    }
    if(this.active_editor == this.open_editors[index]) {
      this.active_editor = this.open_editors[index - 1];
      this.activeEditorUpdate.next(this.active_editor.type);
    }
    this.open_editors[index].close();
    this.open_editors.splice(index, 1);
  }

  getOpenEditors(): Editor[] {
    return this.open_editors;
  }

  private createNewEditor(name: string, assetIndex: number, type: EditorType) {
    let nEditor: Editor = new Editor(type, name, true, assetIndex);
    let nIndex = this.open_editors.push(nEditor) - 1;
    this.setActiveEditor(nIndex);
  }
}
