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
  private readonly EW_MIN_WIDTH: number= 600;
  private readonly AW_MIN_WIDTH: number = 150;

  private prevWinSize: {width: number, height: number} = {width: 1024, height: 554};
  private prevToolsW = 150;
  private prevAssetsW = 150;

  constructor (
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
    this.electronService.addRendererListener(IPCChannels.windowRes, (event, args: any[]) => {
      for(let i = 0; i < args.length; i++) {
        if('width' in args[i] && 'height' in args[i] && this.prevWinSize) {
          this.setWindowSizes(args[i]);
        }
      }
    });

    this.electronService.send(IPCChannels.windowMax);
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

  private setWindowSizes(windowSize: {width: number, height: number} = this.prevWinSize) {

    const pTools = this.prevToolsW / this.prevWinSize.width;
    const pAssets = this.prevAssetsW / this.prevWinSize.width;

    let toolsWidth = Math.max(Math.trunc(pTools * windowSize.width), this.TW_MIN_WIDTH);
    let assetsWidth = Math.max(Math.trunc(pAssets * windowSize.width), this.AW_MIN_WIDTH);
    let editorWidth = windowSize.width - toolsWidth - assetsWidth;

    if(editorWidth < this.EW_MIN_WIDTH) {
      if(this.resizing === Resize.NONE) {
        console.error('Invalid Window Size on Resize.NONE');
        return;
      }
      
      const diff = this.EW_MIN_WIDTH - editorWidth;
      if(this.resizing === Resize.LEFT) {
        if(assetsWidth - diff >= this.AW_MIN_WIDTH) {
          assetsWidth -= diff;
        }else if(toolsWidth - diff >= this.TW_MIN_WIDTH) {
          toolsWidth -= diff;
        }else {
          console.error('Invalid set of window widths');
        }

      }else if(this.resizing === Resize.RIGHT) {
        if(toolsWidth - diff >= this.TW_MIN_WIDTH) {
          toolsWidth -= diff;
        }else if(assetsWidth - diff >= this.AW_MIN_WIDTH) {
          assetsWidth -= diff;
        }else {
          console.error('Invalid set of window widths');
        }
      }
      editorWidth = this.EW_MIN_WIDTH;
    }

    this.toolsWindowElement.style.width = toolsWidth + 'px';
    this.editorWindowElement.style.left = toolsWidth + 'px';
    this.editorWindowElement.style.width = editorWidth + 'px';
    this.assetsWindowElement.style.left = (editorWidth + toolsWidth) + 'px';
    this.assetsWindowElement.style.width = assetsWidth + 'px';

    this.prevWinSize = windowSize;
    this.prevToolsW = toolsWidth;
    this.prevAssetsW = assetsWidth;
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
    let editorRect = this.editorWindowElement.getBoundingClientRect();
    let assetsRect = this.assetsWindowElement.getBoundingClientRect();
    let toolsRect = this.toolsWindowElement.getBoundingClientRect();
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
        if(event.clientX >= this.TW_MIN_WIDTH) {
          this.toolsWindowElement.style.width = event.clientX + 'px';
          this.prevToolsW = event.clientX;
          this.setWindowSizes();
        }
        break;
      
      case Resize.RIGHT:
        if(event.clientX <= assetsRect.right - this.AW_MIN_WIDTH) {
          const assetsWidth = assetsRect.width + (assetsRect.left - event.clientX);
          this.assetsWindowElement.style.widows = assetsWidth + 'px';
          this.prevAssetsW = assetsWidth;
          this.setWindowSizes();
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
