import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorType } from '../../../../shared/ttc-types';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-main-tools',
  templateUrl: './main-tools.component.html',
  styleUrls: ['./main-tools.component.css', '../main.css', '../../editors.css']
})
export class MainToolsComponent {

  constructor(
    private modalService: ModalService,
    private editorSwitchService: EditorSwitchService
  ) { }

  onNewAsset(type: EditorType) {
    // this.editorSwitchService.openPromptModal(type);
    const modalTitle = 'New ' + type;
    this.modalService.openModal(modalTitle, '');
  }

  onNewToken() {
    this.onNewAsset(EditorType.TOKEN);
  }

  onNewBoard() {
    this.onNewAsset(EditorType.BOARD);
  }

  onNewDeck() {
    this.onNewAsset(EditorType.DECK);
  }
}
