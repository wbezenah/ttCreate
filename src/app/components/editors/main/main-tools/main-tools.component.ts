import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { EditorType } from '../../../../shared/ttc-types';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { ModalService } from '../../../../services/modal.service';
import { Subscription } from 'rxjs';
import { IPCChannels } from '../../../../shared/electron-com';

@Component({
  selector: 'app-main-tools',
  templateUrl: './main-tools.component.html',
  styleUrls: ['./main-tools.component.css', '../main.css', '../../editors.css']
})
export class MainToolsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private tempEditorType: EditorType;

  constructor(
    private modalService: ModalService,
    private editorSwitchService: EditorSwitchService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.modalService.modalUpdate.subscribe((value: {channel: IPCChannels, data: string}) => {
      this.editorSwitchService.switchNewAsset(value, this.tempEditorType);
      this.tempEditorType = null;
    }));
  }

  ngOnDestroy(): void {
      for(let sub of this.subscriptions) {
        sub.unsubscribe();
      }
  }

  onNewAsset(type: EditorType) {
    const modalTitle = 'New ' + type;
    this.modalService.openModal(modalTitle, '');
    this.tempEditorType = type;
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
