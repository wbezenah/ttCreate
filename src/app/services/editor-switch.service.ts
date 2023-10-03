import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Editor, EditorType } from '../models/editor.model';
import { ProjectService } from './project.service';
import { ElectronService } from './electron.service';
import { IPCChannels } from '../shared/electron-com';
import { IpcRendererEvent } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class EditorSwitchService {

  private active_editor: Editor;
  private open_editors: Editor[] = [];

  private tempNewEditorType: EditorType | null = null;
  
  activeEditorUpdate: Subject<EditorType> = new Subject<EditorType>();

  constructor(
    private electronService: ElectronService,
    private projectService: ProjectService
  ) {
    this.open_editors.push(this.projectService.getMainEditor());
    this.active_editor = this.open_editors[0];

    this.electronService.addRendererListener(IPCChannels.modalRes, (event: IpcRendererEvent, args: any[]) => {
      for(let arg of args) {
        if('modalResult' in arg) {
          this.createNewEditor(arg.modalResult);
        }
      }
    });
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

  openPromptModal(type: EditorType) {
    const modalTitle = 'New ' + type;
    this.tempNewEditorType = type;
    this.electronService.send(IPCChannels.createModal, {title: modalTitle});
  }

  private createNewEditor(modalResult: string) {
    let nEditor: Editor = new Editor();
    nEditor.closeable = true;
    nEditor.name = modalResult;
    nEditor.type = this.tempNewEditorType;
    this.tempNewEditorType = null;
    this.openEditors.push(nEditor);
    console.log(nEditor);
    this.setActiveEditor(nEditor);
  }
}
