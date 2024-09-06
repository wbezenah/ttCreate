import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit } from '@angular/core';
import { AssetType, TTCAsset } from '../../../shared/ttc-types';
import { Token } from '../../../models/assets/token.model';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../../services/project.service';
import { Rectangle, toRectangle } from '../../../shared/shapes-math';

const enum Status {
  OFF = 0,
  DRAG = 1,
  TOP = 2,
  LEFT = 3,
  RIGHT = 4,
  TOP_LEFT = 5,
  TOP_RIGHT = 6,
  BOTTOM = 7,
  BOTTOM_LEFT = 10,
  BOTTOM_RIGHT = 11
}

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit, AfterViewInit {
  protected element: HTMLElement;

  private subscriptions: Subscription[] = [];


  public width: number;
  public height: number;

  public resizable_sides: {top: boolean, left: boolean, right: boolean, bottom: boolean} = {top: true, left: true, right: true, bottom: true}
  boundary?: {top: number, left: number, height: number, width: number};
  private readonly MARGIN: number = 6;
  private status: Status = Status.OFF;
  mouseClick: {x: number, y: number};
  currentX: number = 100;
  currentY: number = 100;
  initialX: number = 100;
  initialY: number = 100;
  initialWidth: number;
  initialHeight: number;

  constructor(
    private projectService: ProjectService,
    @Inject('asset') public asset: TTCAsset,
    @Inject('resizable') public resizable: boolean = true,
    @Inject('draggable') public draggable: boolean = true
  ) { 
    const rect: Rectangle = toRectangle(this.asset.shape);
    this.height = rect.length;
    this.width = rect.width;
    
    this.currentX = this.asset.position.x;
    this.initialX = this.asset.position.x;

    this.currentY = this.asset.position.y;
    this.initialY = this.asset.position.y;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.projectService.assetUpdate.subscribe(
        (value: {type: AssetType, index: number, updates: {property: string, val: any}[]}) => {
          if(value.type === this.asset.type && value.index === this.asset.index) {
            for(let update of value.updates) {
              // if(update.property == 'shape') { this.updateDisplayShape(); }
            }
          }
        }
      )
    );
  }

  ngAfterViewInit(): void {
    this.element = document.getElementsByClassName('asset-comp').item(0) as HTMLElement;
    this.updateElementShapeClass();
  }

  updateElementShapeClass(): void {
    this.element.classList.forEach((value: string) => {if(value != 'asset-comp') {this.element.classList.remove(value);};});
    this.element.classList.add(this.asset.shape.shape_type.toLowerCase());
  }

  get transform() {
    return 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
  }

  private getPosStatus(xPos: number, yPos: number): Status {
    const boundingRect = this.element.getBoundingClientRect();
    let status = 0;
    if(this.resizable_sides.top && yPos <= boundingRect.top + this.MARGIN) {
      status += Status.TOP;
    }if(this.resizable_sides.left && xPos <= boundingRect.left + this.MARGIN) {
      status += Status.LEFT;
    }if(this.resizable_sides.bottom && yPos >= boundingRect.top + boundingRect.height - this.MARGIN) {
      status += Status.BOTTOM;
    }if(this.resizable_sides.right && xPos >= boundingRect.left + boundingRect.width - this.MARGIN) {
      status += Status.RIGHT;
    }
    return status;
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if(this.status != Status.OFF) { return; }

    let tempStatus: number;
    switch(true) {
      case this.resizable && this.draggable:
        tempStatus = this.getPosStatus(event.clientX, event.clientY);
        if(tempStatus > 0) {
          //resize
          this.status = tempStatus;
          this.mouseClick = { x: event.clientX, y: event.clientY };
          const boundingRect = this.element.getBoundingClientRect();
          this.mouseClick = { x: event.clientX, y: event.clientY };
          this.initialWidth = boundingRect.width;
          this.initialHeight = boundingRect.height;
          this.initialX = event.clientX - this.currentX;
          this.initialY = event.clientY - this.currentY;
        }else {
          //drag
          this.status = Status.DRAG;
          this.mouseClick = { x: event.clientX, y: event.clientY };
          this.initialX = event.clientX - this.currentX;
          this.initialY = event.clientY - this.currentY;
        }
        break;

      case this.resizable:
        //resize
        tempStatus = this.getPosStatus(event.clientX, event.clientY);
        if(tempStatus > 0) {
          this.status = tempStatus;
          this.mouseClick = { x: event.clientX, y: event.clientY };
        }
        break;

      case this.draggable:
        //drag
        this.status = Status.DRAG;
        this.mouseClick = { x: event.clientX, y: event.clientY };
        this.initialX = event.clientX - this.currentX;
        this.initialY = event.clientY - this.currentY;
        break;

      default:
        if(this.status != Status.OFF) { this.status = Status.OFF; }
        break;
    }
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    /*
      Update Asset Properties if Drag or Resize happened
    */
    if(this.status != Status.OFF) {
      let options: {property: string, val: any}[] = [];
      if(this.status === Status.DRAG) {
        //options for position
        options.push({
          property: 'position',
          val: {x: this.currentX, y: this.currentY}
        });
      }
      else {
        //options for size
        const boundingRect = this.element.getBoundingClientRect();
        options.push({
          property: 'shape',
          val: new Rectangle(boundingRect.height, boundingRect.width)
        });
      }
      
      this.projectService.updateAsset(this.asset.type, this.asset.index, ...options);

      // End Drag/Resize
      this.status = Status.OFF;
      this.mouseClick = null;
      this.element.style.cursor = 'auto';
    }
  }

  @HostListener('mousemove', ['$event']) onMouseOverBox(event: MouseEvent) {
    if(this.resizable && !this.mouseClick) {
      let currStatus = this.getPosStatus(event.clientX, event.clientY);
      switch(currStatus) {
        case Status.TOP:
        case Status.BOTTOM:
          this.element.style.cursor = 'ns-resize';
          break;
        case Status.LEFT:
        case Status.RIGHT:
          this.element.style.cursor = 'ew-resize';
          break;
        case Status.TOP_LEFT:
        case Status.BOTTOM_RIGHT:
          this.element.style.cursor = 'nwse-resize';
          break;
        case Status.TOP_RIGHT:
        case Status.BOTTOM_LEFT:
          this.element.style.cursor = 'nesw-resize';
          break;
        default:
          this.element.style.cursor = 'auto';
          break;
      }
    }
  }

  @HostListener('window:mousemove', ['$event']) onMouseDrag(event: MouseEvent) {
    if(this.mouseClick) {
        switch(this.status) {
        case Status.DRAG:
          this.drag(event);
          break;
        case Status.TOP:
          this.setTop(event);
          break;
        case Status.LEFT:
          this.setLeft(event);
          break;
        case Status.RIGHT:
          this.setRight(event);
          break;
        case Status.TOP_LEFT:
          this.setTop(event);
          this.setLeft(event);
          break;
        case Status.TOP_RIGHT:
          this.setTop(event);
          this.setRight(event);
          break;
        case Status.BOTTOM:
          this.setBottom(event);
          break;
        case Status.BOTTOM_LEFT:
          this.setBottom(event);
          this.setLeft(event);
          break;
        case Status.BOTTOM_RIGHT:
          this.setBottom(event);
          this.setRight(event);
          break;
        default:
          console.error('ERROR: Incorrect Resize/Drag Status');
          break;
      }
    }

  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        console.log('CMD+S Pressed: Saving to ProjectService');
        // Save Width/Height
        // this.projectService.updateAsset(this.asset.type, this.asset.index, 
        //   {
        //     property: 'shape',
        //     val: new Rectangle(boundingRect.height, boundingRect.width)
        //   }
        // );
    }
  }

  private drag(event: MouseEvent) {
    let boundingRect = this.element.getBoundingClientRect();
    this.currentX = event.clientX - this.initialX;
    this.currentY = event.clientY - this.initialY;
    if(this.boundary) {
      if(this.currentX < 0) { this.currentX = 0; }
      if(this.currentX + boundingRect.width > this.boundary.width) { this.currentX = this.boundary.width - boundingRect.width; }
      if(this.currentY < 0) { this.currentY = 0; }
      if(this.currentY + boundingRect.height > this.boundary.height) { this.currentY = this.boundary.height - boundingRect.height; }
    }
    // this.element.style.transform = 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
  }

  private setTop(event: MouseEvent) {
    let yBefore = this.currentY;
    this.currentY = event.clientY - this.initialY;
    if(this.boundary && this.currentY < 0) {
      this.currentY = 0;
    }

    this.element.style.height = (this.element.getBoundingClientRect().height + yBefore - this.currentY).toString() + 'px';
    // this.element.style.transform = 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
  }

  private setLeft(event: MouseEvent) {
    let xBefore = this.currentX;
    this.currentX = event.clientX - this.initialX;

    if(this.boundary && this.currentX < 0) {
      this.currentX = 0;
    }

    this.element.style.width = (this.element.getBoundingClientRect().width + xBefore - this.currentX).toString() + 'px';
    // this.element.style.transform = 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
  }

  private setRight(event: MouseEvent) {
    let currLeft = this.element.getBoundingClientRect().left;
    let calculatedWidth = this.initialWidth + event.clientX - this.mouseClick.x;
    if(this.boundary && currLeft + calculatedWidth > this.boundary.left + this.boundary.width) {
      calculatedWidth = this.boundary.left + this.boundary.width - currLeft;
    }
    this.element.style.width = calculatedWidth.toString() + 'px';
  }

  private setBottom(event: MouseEvent) {
    let currTop = this.element.getBoundingClientRect().top;
    let calculatedHeight = this.initialHeight + event.clientY - this.mouseClick.y;
    if(this.boundary && currTop + calculatedHeight > this.boundary.top + this.boundary.height) {
      calculatedHeight = this.boundary.top + this.boundary.height - currTop;
    }
    this.element.style.height = calculatedHeight.toString() + 'px';
  }

}
