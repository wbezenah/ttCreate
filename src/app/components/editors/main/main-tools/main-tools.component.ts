import { Component } from '@angular/core';
import { EditorType } from '../../../../models/editor.model';
import { EditorSwitchService } from '../../../../services/editor-switch.service';

@Component({
  selector: 'app-main-tools',
  templateUrl: './main-tools.component.html',
  styleUrls: ['./main-tools.component.css', '../main.css', '../../editors.css']
})
export class MainToolsComponent {

  constructor(
    private editorSwitchService: EditorSwitchService
  ) { }

  onNewAsset(type: EditorType) {
    this.editorSwitchService.openPromptModal(type);
  }
}
