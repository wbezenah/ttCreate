import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appToolsHost]'
})
export class ToolsHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
