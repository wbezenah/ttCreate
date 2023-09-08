import { Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[cardHost]'
})
export class CardHostDirective {
  
  constructor(public viewContainerRef: ViewContainerRef) { }

}
