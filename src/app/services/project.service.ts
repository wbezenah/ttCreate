import { Injectable } from '@angular/core';
import { Editor, EditorType } from '../models/editor.model';
import { Project } from '../models/project.model';
import { ElectronService } from './electron.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private main_editor = new Editor(EditorType.MAIN, 'Main', false);

  private loaded_project: Project = new Project;

  constructor(
    private electronService: ElectronService
  ) { }

  getMainEditor(): Editor {
    return this.main_editor;
  }

  loadProject() {
    //[] allows all file types. need to change to project file extension
    this.electronService.openFile([], true);

    firstValueFrom(this.electronService.fileResults).then((value: Buffer[]) => {
      // console.log(value[0].toString());
    });
  }
}
