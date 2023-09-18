import { AfterViewInit, Component, ComponentRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CardInfo } from '../../models/card-info.model';
import { CardHostDirective } from '../../directives/card-host.directive';
import { CardComponent } from '../card/card.component';
import { ElectronService } from '../../services/electron.service';
import { IPCChannels } from '../../shared/electron-com';

enum Resize {
  NONE = 0,
  LEFT = 1,
  RIGHT = 2
}

@Component({
  selector: 'app-creator-window',
  templateUrl: './creator-window.component.html',
  styleUrls: ['./creator-window.component.css']
})
export class CreatorWindowComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @ViewChild(CardHostDirective, {static: true}) cardHost!: CardHostDirective;
  componentRefs: ComponentRef<CardComponent>[] = [];
  cards: CardInfo[] = [];

  private editorWindowElement: HTMLElement;
  private toolsWindowElement: HTMLElement;
  private assetsWindowElement: HTMLElement;

  private readonly RESIZE_MARGIN_PX: number = 4;
  private readonly TW_MIN_WIDTH: number = 150;
  private readonly EW_MIN_WIDTH: number= 400;
  private readonly AW_MIN_WIDTH: number = 150;

  constructor (
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
    this.electronService.addRendererListener(IPCChannels.windowRes, (event, args: any[]) => {
      if('max' in args[0] || ('width' in args[0] && 'height' in args[0])) {
        // const assetsWidth = this.assetsWindowElement.getBoundingClientRect().width;
        // const editorLeft = this.editorWindowElement.getBoundingClientRect().left;
        // this.assetsWindowElement.style.left = `calc(100% - ${assetsWidth}px)`;
        // this.editorWindowElement.style.width = `calc(100% - ${assetsWidth}px - ${editorLeft})`;
      }
    });
  }

  ngOnDestroy(): void {
    for(let cf of this.componentRefs) {
      if(cf) {
        cf.destroy();
      }
    }
  }

  ngAfterViewInit(): void {
    this.editorWindowElement = document.getElementsByClassName('editor-window').item(0) as HTMLElement;
    this.toolsWindowElement = document.getElementsByClassName('tools-window').item(0) as HTMLElement;
    this.assetsWindowElement = document.getElementsByClassName('assets-window').item(0) as HTMLElement;
  }

  private resizing: Resize = Resize.NONE;

  @HostListener('mousedown', ['$event']) onClick(event: MouseEvent) {
    const editorRect = this.editorWindowElement.getBoundingClientRect();
    if(event.clientX <= editorRect.left + this.RESIZE_MARGIN_PX) {
      this.resizing = Resize.LEFT;
    }else if(event.clientX >= editorRect.right - this.RESIZE_MARGIN_PX) {
      this.resizing = Resize.RIGHT;
    }
  }

  @HostListener('window:mousemove', ['$event']) onDrag(event: MouseEvent) {
    const editorRect = this.editorWindowElement.getBoundingClientRect();
    const assetsRect = this.assetsWindowElement.getBoundingClientRect();
    const buttonRect = this.toolsWindowElement.getBoundingClientRect();
    if(
      this.resizing === Resize.NONE &&
      ((event.clientX <= editorRect.left + this.RESIZE_MARGIN_PX && event.clientX >= editorRect.left) ||
      (event.clientX <= editorRect.right && event.clientX >= editorRect.right - this.RESIZE_MARGIN_PX))
    ){
      document.body.style.cursor = 'ew-resize';
    }else {
      document.body.style.cursor = 'auto'
    }

    switch(this.resizing) {
      case Resize.NONE:
        break;
      case Resize.LEFT:
        //check that left resize is valid for left editor
        if(event.clientX >= this.TW_MIN_WIDTH) {
          //check that left resize is valid for center editor
          if(assetsRect.left - event.clientX <= this.EW_MIN_WIDTH) {
            //min width reached, maintain width while updating assetsWindow
            const assetsWindowLeft = Math.min((assetsRect.right - this.AW_MIN_WIDTH), (assetsRect.left + (event.clientX - editorRect.left)));
            this.assetsWindowElement.style.left = assetsWindowLeft + 'px';
            this.assetsWindowElement.style.width = `calc(100% - ${assetsWindowLeft}px)`;
            const editorWindowLeft = editorRect.left + (assetsWindowLeft - assetsRect.left);
            this.editorWindowElement.style.left = editorWindowLeft + 'px';
            this.toolsWindowElement.style.width = editorWindowLeft + 'px';
          }else {
            this.editorWindowElement.style.left = event.clientX + 'px';
            this.toolsWindowElement.style.width = event.clientX + 'px';
            this.editorWindowElement.style.width = (assetsRect.left - event.clientX) + 'px';
          }
        }
        break;

      case Resize.RIGHT:
        if(event.clientX <= assetsRect.right - this.AW_MIN_WIDTH) {
          if(event.clientX - editorRect.left <= this.EW_MIN_WIDTH) {
            //min width reached, maintain width while updating toolsWindow
            const editorWindowLeft = Math.max(this.TW_MIN_WIDTH, (buttonRect.width - (assetsRect.left - event.clientX)));
            this.toolsWindowElement.style.width = editorWindowLeft + 'px';
            this.editorWindowElement.style.left = editorWindowLeft + 'px';
            const assetsWindowLeft = editorWindowLeft + this.EW_MIN_WIDTH
            this.assetsWindowElement.style.left = assetsWindowLeft + 'px';
            this.assetsWindowElement.style.width = `calc(100% - ${assetsWindowLeft}px)`;

          }else {
            this.assetsWindowElement.style.left = event.clientX + 'px';
            this.assetsWindowElement.style.width = `calc(100% - ${event.clientX}px)`;
            this.editorWindowElement.style.width = (event.clientX - editorRect.left) + 'px';
          }
        }
        break;
    }
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.resizing = Resize.NONE;
    document.body.style.cursor = 'auto';
  }

  onNewCard() {
    let newCardInfo: CardInfo = new CardInfo('New Card');
    const viewContainerRef = this.cardHost.viewContainerRef;
    const newComponentRef = viewContainerRef.createComponent(CardComponent);
    newComponentRef.instance.cardInfo = newCardInfo;
    newComponentRef.instance.width = 200;
    newComponentRef.instance.height = 300;
    this.componentRefs.push(newComponentRef);
  }
}
