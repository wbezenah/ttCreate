import { AfterViewInit, Component, ComponentRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CardInfo } from '../../models/card-info.model';
import { CardHostDirective } from '../../directives/card-host.directive';
import { CardComponent } from '../card/card.component';
import { WindowSizeService } from '../../services/window-size.service';
import { ElectronService } from '../../services/electron.service';

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

  private boxContainerElement: HTMLElement;
  private buttonAreaElement: HTMLElement;
  private assetsAreaElement: HTMLElement;

  private readonly RESIZE_MARGIN_PX: number = 4;
  private readonly BA_MIN_WIDTH: number = 150;
  private readonly BC_MIN_WIDTH: number= 400;
  private readonly AA_MIN_WIDTH: number = 150;

  constructor (
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    for(let cf of this.componentRefs) {
      if(cf) {
        cf.destroy();
      }
    }
  }

  ngAfterViewInit(): void {
    this.boxContainerElement = document.getElementsByClassName('box-container').item(0) as HTMLElement;
    this.buttonAreaElement = document.getElementsByClassName('button-area').item(0) as HTMLElement;
    this.assetsAreaElement = document.getElementsByClassName('assets-area').item(0) as HTMLElement;
  }

  private resizing: Resize = Resize.NONE;

  @HostListener('mousedown', ['$event']) onClick(event: MouseEvent) {
    const boxRect = this.boxContainerElement.getBoundingClientRect();
    if(event.clientX <= boxRect.left + this.RESIZE_MARGIN_PX) {
      this.resizing = Resize.LEFT;
    }else if(event.clientX >= boxRect.right - this.RESIZE_MARGIN_PX) {
      this.resizing = Resize.RIGHT;
    }
  }

  @HostListener('window:mousemove', ['$event']) onDrag(event: MouseEvent) {
    const boxRect = this.boxContainerElement.getBoundingClientRect();
    const assetsRect = this.assetsAreaElement.getBoundingClientRect();
    const buttonRect = this.buttonAreaElement.getBoundingClientRect();
    if(
      this.resizing === Resize.NONE &&
      ((event.clientX <= boxRect.left + this.RESIZE_MARGIN_PX && event.clientX >= boxRect.left) ||
      (event.clientX <= boxRect.right && event.clientX >= boxRect.right - this.RESIZE_MARGIN_PX))
    ){
      document.body.style.cursor = 'ew-resize';
    }else {
      document.body.style.cursor = 'auto'
    }

    switch(this.resizing) {
      case Resize.NONE:
        break;
      case Resize.LEFT:
        if(event.clientX >= this.BA_MIN_WIDTH) {
          if(assetsRect.left - event.clientX <= this.BC_MIN_WIDTH) {
            //min width reached, maintain width while updating assetsArea
            // const newAssetsLeft = Math.max(this.AA_MIN_WIDTH, (assetsRect.left + (event.clientX - boxRect.left)));
            const newAssetsLeft = Math.min((assetsRect.right - this.AA_MIN_WIDTH), (assetsRect.left + (event.clientX - boxRect.left)));
            this.assetsAreaElement.style.left = newAssetsLeft + 'px';
            this.assetsAreaElement.style.width = (assetsRect.right - newAssetsLeft) + 'px';
            const newBoxLeft = boxRect.left + (newAssetsLeft - assetsRect.left);
            this.boxContainerElement.style.left = newBoxLeft + 'px';
            this.buttonAreaElement.style.width = newBoxLeft + 'px';
          }else {
            this.boxContainerElement.style.left = event.clientX + 'px';
            this.buttonAreaElement.style.width = event.clientX + 'px';
            this.boxContainerElement.style.width = (assetsRect.left - event.clientX) + 'px';
          }
        }
        break;

      case Resize.RIGHT:
        if(event.clientX <= assetsRect.right - this.AA_MIN_WIDTH) {
          if(event.clientX - boxRect.left <= this.BC_MIN_WIDTH) {
            //min width reached, maintain width while updating buttonArea
            const newBoxLeft = Math.max(this.BA_MIN_WIDTH, (buttonRect.width - (assetsRect.left - event.clientX)));
            this.buttonAreaElement.style.width = newBoxLeft + 'px';
            this.boxContainerElement.style.left = newBoxLeft + 'px';
            const newAssetsLeft = newBoxLeft + this.BC_MIN_WIDTH
            this.assetsAreaElement.style.left = newAssetsLeft + 'px';
            this.assetsAreaElement.style.width = (assetsRect.right - newAssetsLeft) + 'px';

          }else {
            this.assetsAreaElement.style.left = event.clientX + 'px';
            this.assetsAreaElement.style.width = (assetsRect.right - event.clientX) + 'px';
            this.boxContainerElement.style.width = (event.clientX - boxRect.left) + 'px';
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
