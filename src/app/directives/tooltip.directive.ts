import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  @Input() tooltip: string = '';
  @Input() direction: 'top' | 'left' | 'bottom' | 'right' = 'bottom';
  @Input() delayMS: string = '10';

  private tooltipElement: HTMLElement;

  private MARGIN = 3;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    if(!this.tooltipElement) { this.showTooltip(); }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if(this.tooltipElement) { this.hideTooltip(); }
  }

  private showTooltip() {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltip));

    const parentBox = this.elRef.nativeElement.getBoundingClientRect();

    switch(this.direction) {
      case 'top':
        this.tooltipElement.style.bottom = (parentBox.top - this.MARGIN) + 'px';
        this.tooltipElement.style.left = (parentBox.left + 1) + 'px'
        break;
      case 'left':
        this.tooltipElement.style.right = (parentBox.left - this.MARGIN) + 'px';
        this.tooltipElement.style.top = (parentBox.top) + 'px';
        break;
      case 'bottom':
        this.tooltipElement.style.top = (parentBox.bottom + this.MARGIN) + 'px';
        this.tooltipElement.style.left = (parentBox.left + 1) + 'px';
        break;
      case 'right':
        this.tooltipElement.style.left = (parentBox.right + this.MARGIN) + 'px';
        this.tooltipElement.style.top = (parentBox.top) + 'px';
        break;
    }

    this.renderer.appendChild(document.body, this.tooltipElement);
    this.renderer.addClass(this.tooltipElement, 'tooltip');
  }

  hideTooltip() {
    window.setTimeout(() => {
      if(this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
      }
      this.tooltipElement = null;
    }, parseInt(this.delayMS));
  }

}
