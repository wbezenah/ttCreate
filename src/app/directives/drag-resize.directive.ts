import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

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

@Directive({
  selector: '[dragResize]'
})
export class DragResizeDirective implements OnInit {

  @Input('boundary') boundary?: {top: number, left: number, height: number, width: number};
  @Input('resizable') resizable: boolean = true;
  @Input('draggable') draggable: boolean = true;
  @Input('resizableSides') resizable_sides: {top: boolean, left: boolean, right: boolean, bottom: boolean} = {top: true, left: true, right: true, bottom: true};

  private readonly MARGIN = 6;

  private element: HTMLElement;
  status: Status = Status.OFF;
  mouseClick: {x: number, y: number};

  currentX: number = 0;
  currentY: number = 0;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;

  constructor(
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.element = this.elRef.nativeElement as HTMLElement;
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
    this.status = Status.OFF;
    this.mouseClick = null;
    this.element.style.cursor = 'auto';
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
    this.element.style.transform = 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
  }

  private setTop(event: MouseEvent) {
    let yBefore = this.currentY;
    this.currentY = event.clientY - this.initialY;
    if(this.boundary && this.currentY < 0) {
      this.currentY = 0;
    }

    this.element.style.height = (this.element.getBoundingClientRect().height + yBefore - this.currentY).toString() + 'px';
    this.element.style.transform = 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
  }

  private setLeft(event: MouseEvent) {
    let xBefore = this.currentX;
    this.currentX = event.clientX - this.initialX;

    if(this.boundary && this.currentX < 0) {
      this.currentX = 0;
    }

    this.element.style.width = (this.element.getBoundingClientRect().width + xBefore - this.currentX).toString() + 'px';
    this.element.style.transform = 'translate3d('+ this.currentX + 'px,' + this.currentY + 'px,' + '0px)';
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
