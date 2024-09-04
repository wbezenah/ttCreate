import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ChangeDetectorRef, HostListener } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ElectronService } from '../../services/electron.service';
import { IPCChannels } from '../../shared/electron-com';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit{
  title: string = 'modal-title[empty]';
  body: string = 'modal-body[empty]';

  @Input() position: {top: number, left: number} = {top: 0, left: 0};
  @Input() size: {width: number, height: number} = {width: 0, height: 0};

  private inputElement: HTMLInputElement;

  constructor(private modalService: ModalService, private electronService: ElectronService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
      this.electronService.addRendererListener(IPCChannels.windowRes, (event, args: any[]) => {
        for(let i = 0; i < args.length; i++) {
          if('width' in args[i] && 'height' in args[i]) {
            // console.log('windowRes')
            this.size = {width: args[i].width / 3, height: args[i].height / 3};
            this.position = {
              top: args[i].height / 2 - (this.size.height / 2),
              left: args[i].width / 2 - (this.size.width / 2)
            };
            this.changeDetectorRef.detectChanges();
          }
        }
      });

      this.inputElement = document.getElementById('name') as HTMLInputElement;
      this.inputElement.focus();
  }

  @HostListener('window:keydown.enter', ['$event']) handleKeyDown(event: KeyboardEvent) {
    this.confirmModal();
  }

  closeModal() {
    this.modalService.closeModal();
  }
  confirmModal() {
    const res = this.inputElement.value;
    this.modalService.confirm(res);
  }
}
