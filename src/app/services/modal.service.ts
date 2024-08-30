import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IPCChannels } from '../shared/electron-com';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalUpdate: Subject<{channel: IPCChannels, data: any}> = new Subject();

  constructor() {}

  openModal(title: string, body: string) {
    this.modalUpdate.next({channel: IPCChannels.openModal, data: title});
  }

  closeModal() {
    this.modalUpdate.next({channel: IPCChannels.closeModal, data: 'close'});
  }

  confirm() {
    this.modalUpdate.next({channel: IPCChannels.modalRes, data: 'confirm'});
    this.closeModal();
  }
}
