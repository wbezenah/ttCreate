import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Editor} from '../models/editor.model';
import { ETYPE_TO_ATYPE, EditorType } from '../shared/ttc-types';
import { ProjectService } from './project.service';
import { ElectronService } from './electron.service';
import { IPCChannels } from '../shared/electron-com';
import { IpcRendererEvent } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class EditorSwitchService {

  private active_editor: Editor;
  private open_editors: Editor[] = [new Editor(EditorType.MAIN, 'Main', false, -1)];

  private tempNewEditorType: EditorType | null = null;
  
  activeEditorUpdate: Subject<EditorType> = new Subject<EditorType>();

  constructor(
    private electronService: ElectronService,
    private projectService: ProjectService
  ) {
    this.active_editor = this.open_editors[0];

    this.electronService.addRendererListener(IPCChannels.modalRes, (event: IpcRendererEvent, args: any[]) => {
      // console.log(args);
      for(let arg of args) {
        if('modalResult' in arg) {
          const index = this.projectService.newAsset(ETYPE_TO_ATYPE(this.tempNewEditorType), arg.modalResult);
          this.createNewEditor(arg.modalResult, index);
        }
      }
    });
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

  openPromptModal(type: EditorType) {
    const modalTitle = 'New ' + type;
    this.tempNewEditorType = type;
    this.electronService.send(IPCChannels.createModal, {title: modalTitle});
  }

  private createNewEditor(name: string, assetIndex: number) {
    let nEditor: Editor = new Editor(this.tempNewEditorType, name, true, assetIndex);
    this.tempNewEditorType = null;
    let nIndex = this.open_editors.push(nEditor) - 1;
    this.setActiveEditor(nIndex);
  }
}
