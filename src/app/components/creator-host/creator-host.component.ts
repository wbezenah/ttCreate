import { AfterViewInit, Component, ComponentRef, HostListener, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CardComponent } from '../asset-types/card/card.component';
import { ElectronService } from '../../services/electron.service';
import { IPCChannels } from '../../shared/electron-com';
import { EditorSwitchService } from '../../services/editor-switch.service';
import { Editor } from '../../models/editor.model';
import { EditorType } from '../../shared/ttc-types';
import { ModalService } from '../../services/modal.service';
import { AssetHostDirective } from '../../directives/asset-host.directive';
import { ModalComponent } from '../modal/modal.component';

enum Resize {
  NONE = 0,
  LEFT = 1,
  RIGHT = 2
}

@Component({
  selector: 'app-creator-window',
  templateUrl: './creator-host.component.html',
  styleUrls: ['./creator-host.component.css']
})
export class CreatorHostComponent implements OnInit, OnDestroy, AfterViewInit {

  componentRefs: ComponentRef<CardComponent>[] = [];

  @ViewChild(AssetHostDirective, {static: true}) modalHost!: AssetHostDirective;
  private componentRef: ComponentRef<ModalComponent>;

  private editorWindowElement: HTMLElement;
  private toolsWindowElement: HTMLElement;
  private assetsWindowElement: HTMLElement;

  private activeElements: HTMLCollectionOf<Element>;
  private open_editors: Editor[] = [];

  private readonly RESIZE_MARGIN_PX: number = 4;

  private readonly TW_MIN_WIDTH: number = 200;
  private readonly TW_MAX_WIDTH: number = 400;
  private readonly EW_MIN_WIDTH: number= 500;
  private readonly AW_MIN_WIDTH: number = 200;
  private readonly AW_MAX_WIDTH: number = 400;

  private prevWinSize: {width: number, height: number} = {width: 1024, height: 554};
  private prevToolsW = 150;
  private prevAssetsW = 150;

  constructor (
    private modalService: ModalService,
    private electronService: ElectronService,
    private editorSwitchService: EditorSwitchService
  ) { }

  ngOnInit(): void {
    //unnecessary for application build but necessary for browser instance
    if(!this.electronService.isElectron) {
      const docBox = document.body.getBoundingClientRect();
      this.prevWinSize = {width: docBox.width, height: docBox.width};
    }
    this.electronService.addRendererListener(IPCChannels.windowRes, (event, args: any[]) => {
      for(let i = 0; i < args.length; i++) {
        if('width' in args[i] && 'height' in args[i] && this.prevWinSize) {
          this.setWindowSizes(args[i]);
        }
      }
    });

    this.electronService.send(IPCChannels.windowMax);

    this.updateActiveComponents();

    this.editorSwitchService.activeEditorUpdate.subscribe((value: EditorType) => {
      this.updateActiveComponents();
    });

    this.modalService.modalUpdate.subscribe((value: {channel: IPCChannels, data: string}) => {
      switch(value.channel){
        case IPCChannels.openModal:
          this.openModal(value.data);
          break;
        case IPCChannels.closeModal:
          this.closeModal();
          break;
        default:
          break;
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

  private setWindowSizes(windowSize: {width: number, height: number} = this.prevWinSize) {

    const pTools = this.prevToolsW / this.prevWinSize.width;
    const pAssets = this.prevAssetsW / this.prevWinSize.width;

    let toolsWidth = Math.max(Math.trunc(pTools * windowSize.width), this.TW_MIN_WIDTH);
    toolsWidth = Math.min(toolsWidth, this.TW_MAX_WIDTH);
    let assetsWidth = Math.max(Math.trunc(pAssets * windowSize.width), this.AW_MIN_WIDTH);
    assetsWidth = Math.min(assetsWidth, this.AW_MAX_WIDTH);
    let editorWidth = windowSize.width - toolsWidth - assetsWidth;

    if(editorWidth < this.EW_MIN_WIDTH) {
      if(this.resizing === Resize.NONE) {
        // console.error('Invalid Window Size on Resize.NONE... Attempting to reset window');
        toolsWidth = this.TW_MIN_WIDTH;
        assetsWidth = this.AW_MIN_WIDTH;
        editorWidth = windowSize.width - toolsWidth - assetsWidth;
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
  private clicking: boolean = false;

  @HostListener('mousedown', ['$event']) onClick(event: MouseEvent) {
    this.clicking = true;
    const editorRect = this.editorWindowElement.getBoundingClientRect();
    if(event.clientX <= editorRect.left + this.RESIZE_MARGIN_PX && event.clientX >= editorRect.left) {
      this.resizing = Resize.LEFT;
    }else if(event.clientX >= editorRect.right - this.RESIZE_MARGIN_PX && event.clientX <= editorRect.right) {
      this.resizing = Resize.RIGHT;
    }
  }

  @HostListener('window:mousemove', ['$event']) onDrag(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    let editorRect = this.editorWindowElement.getBoundingClientRect();
    let assetsRect = this.assetsWindowElement.getBoundingClientRect();
    let toolsRect = this.toolsWindowElement.getBoundingClientRect();

    if(this.resizing === Resize.NONE && !this.clicking && event.clientX >= editorRect.left && event.clientX <= editorRect.left + this.RESIZE_MARGIN_PX) {
      document.body.style.cursor = 'ew-resize';
      //case left
      this.toolsWindowElement.classList.add('resize');
    }
    else if(this.resizing === Resize.NONE && !this.clicking && event.clientX <= editorRect.right && event.clientX >= editorRect.right - this.RESIZE_MARGIN_PX) {
      document.body.style.cursor = 'ew-resize';
      //case right
      this.assetsWindowElement.classList.add('resize');
    }
    else if(this.resizing !== Resize.NONE) {
      document.body.style.cursor = 'ew-resize';
    }
    else {
      document.body.style.cursor = 'auto';
      this.toolsWindowElement.classList.remove('resize');
      this.assetsWindowElement.classList.remove('resize');
    }

    switch(this.resizing) {
      case Resize.NONE:
        break;
      
      case Resize.LEFT:
        if(event.clientX >= this.TW_MIN_WIDTH && event.clientX <= this.TW_MAX_WIDTH) {
          this.toolsWindowElement.style.width = event.clientX + 'px';
          this.prevToolsW = event.clientX;
          this.setWindowSizes();
        }
        break;
      
      case Resize.RIGHT:
        if(event.clientX <= assetsRect.right - this.AW_MIN_WIDTH && event.clientX >= assetsRect.right - this.AW_MAX_WIDTH) {
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
    this.clicking = false;
    document.body.style.cursor = 'auto';
  }

  private updateActiveComponents(): void {
    this.open_editors = this.editorSwitchService.getOpenEditors();
    this.activeElements = document.getElementsByClassName(this.editorSwitchService.getActiveEditor().type.toLowerCase());

    if(!this.activeElements) {
      console.error('ERROR. NO SUCH ELEMENTS');
      return;
    }

    for(let eT of Object.keys(EditorType)) {
      let inactiveElements = document.getElementsByClassName(eT.toLowerCase());
      for(let i = 0; i < inactiveElements.length; i++) {
        inactiveElements.item(i).classList.remove('comp-active');
      }
    }

    for(let i = 0; i < this.activeElements.length; i++) {
      this.activeElements.item(i).classList.add('comp-active');
    }
  }

  
  openEditor(event: MouseEvent, index: number): void {
    let closeDiv: HTMLElement = document.getElementsByClassName('close').item(index - 1) as HTMLElement;
    if(closeDiv && closeDiv.contains(event.target as any)) {
      this.editorSwitchService.closeEditor(index);
      return;
    }
    this.editorSwitchService.setActiveEditor(index);
  }

  get editorList(): Editor[] {
    return this.open_editors;
  }

  private openModal(title: string): void {
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();
    //add constructor fields below
    const customInjector = Injector.create({providers: [
      {provide: ModalService, useValue: this.modalService},
      {provide: ElectronService, useValue: this.electronService}
    ]});
    this.componentRef = viewContainerRef.createComponent<ModalComponent>(ModalComponent, {injector: customInjector});
    // this.componentRef.instance.asset = this.activeToken;
    this.componentRef.instance.title = title;
    this.componentRef.instance.size = {
      width: this.prevWinSize.width / 3,
      height: this.prevWinSize.height / 3
    };
    this.componentRef.instance.position = {
      top: this.prevWinSize.height / 2 - (this.componentRef.instance.size.height / 2),
      left: this.prevWinSize.width / 2 - (this.componentRef.instance.size.width / 2)
    };
  }

  private closeModal(): void {
    const viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();
  }
}
