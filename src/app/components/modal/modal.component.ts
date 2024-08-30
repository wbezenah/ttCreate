import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent{
  @Input() title: string = 'modal-title[empty]';
  @Input() body: string = 'modal-body[empty]';

  constructor(private modalService: ModalService) { }

  close() {
    this.modalService.closeModal();
  }
  confirm() {
  }
}
