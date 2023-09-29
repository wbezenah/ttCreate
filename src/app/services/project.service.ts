import { Injectable } from '@angular/core';
import { Editor, EditorType } from '../models/editor.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor() { }

  getMainEditor(): Editor {
    return {type: EditorType.MAIN, name: 'Main', closeable: true};
  }
}
