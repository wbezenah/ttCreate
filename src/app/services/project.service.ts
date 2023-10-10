import { Injectable } from '@angular/core';
import { Editor, EditorType } from '../models/editor.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private main_editor = new Editor(EditorType.MAIN, 'Main', false);

  constructor() { }

  getMainEditor(): Editor {
    return this.main_editor;
  }
}
