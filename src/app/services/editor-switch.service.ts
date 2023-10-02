import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Editor, EditorType } from '../models/editor.model';
import { ProjectService } from './project.service';
import { ElectronService } from './electron.service';
import { IPCChannels } from '../shared/electron-com';

@Injectable({
  providedIn: 'root'
})
export class EditorSwitchService {

  private active_editor: Editor;
  private open_editors: Editor[] = [];
  
  activeEditorUpdate: Subject<EditorType> = new Subject<EditorType>();

  constructor(
    private electronService: ElectronService,
    private projectService: ProjectService
  ) {
    this.open_editors.push(this.projectService.getMainEditor());
    this.active_editor = this.open_editors[0];
  }

  get activeEditor(): Editor {
    return this.active_editor;
  }

  isActive(editor: Editor): boolean {
    return this.active_editor === editor;
  }

  setActiveEditor(editor: Editor): EditorType {
    this.active_editor = editor;
    this.activeEditorUpdate.next(this.activeEditor.type);
    return this.active_editor.type;
  }

  get openEditors(): Editor[] {
    return this.open_editors;
  }

  newEditor(type: EditorType) {
    // let nEditor: Editor = new Editor();
    // nEditor.closeable = true;
    // nEditor.name = 'new ' + type + ' editor';
    // nEditor.type = type;
    // this.openEditors.push(nEditor);
    // this.setActiveEditor(nEditor);
    const modalTitle = 'New ' + type;
    this.electronService.send(IPCChannels.createModal, {title: modalTitle});
  }
}
